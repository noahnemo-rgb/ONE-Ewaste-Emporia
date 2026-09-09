/**
 * ONE E-Waste Emporia & Restorative Guild — Backend Server
 * Express.js with Stripe Checkout, Webhooks, and Work Order APIs
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const shippingService = require('./shipping');
const notificationService = require('./notifications');
const storageService = require('./storage');
const certificateEngine = require('./certificates');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (use raw body for Stripe webhooks)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));

// Mock in-memory database store for demonstration / local testing
const db = {
  users: [],
  workOrders: [],
  transactions: [],
  estimates: []
};

// -------------------------------------------------------------
// API: Create Work Order & Initialize Stripe Checkout Session
// -------------------------------------------------------------
app.post('/api/work-orders/submit', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      serviceType,
      deviceType,
      deviceModel,
      reportedIssue,
      unrepairedDisposition,
      charitableDonation
    } = req.body;

    if (!fullName || !email || !serviceType || !deviceType) {
      return res.status(400).json({ error: 'Missing required work order fields.' });
    }

    const workOrderId = 'WO-' + Date.now().toString(36).toUpperCase();
    const donationCents = parseInt(charitableDonation || 0, 10) * 100;
    const isRepair = serviceType === 'repair_diagnostic';
    const diagnosticFeeCents = isRepair ? 5000 : 0; // $50 flat rate

    const newWorkOrder = {
      id: workOrderId,
      client: { fullName, email, phone, address },
      serviceType,
      deviceType,
      deviceModel,
      reportedIssue,
      unrepairedDisposition: unrepairedDisposition || 'donate_to_guild',
      status: isRepair ? 'awaiting_diagnostic_deposit' : 'label_dispatched',
      diagnosticFeeCents,
      donationCents,
      createdAt: new Date().toISOString()
    };
    db.workOrders.push(newWorkOrder);

    // If payment is required ($50 diagnostic deposit and/or charitable donation)
    const lineItems = [];
    if (isRepair) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Initial Diagnostic & Written Estimate Fee',
            description: 'Non-refundable diagnostic bench fee. Credited toward final invoice if repair is approved.',
          },
          unit_amount: 5000,
        },
        quantity: 1,
      });
    }

    if (donationCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Charitable Donation to ONE Vocational Rehabilitation Guild',
            description: 'Tax-deductible gift supporting fair-chance re-entry and disabled apprentice training.',
          },
          unit_amount: donationCents,
        },
        quantity: 1,
      });
    }

    if (lineItems.length > 0) {
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: email,
        metadata: {
          workOrderId,
          serviceType,
          unrepairedDisposition
        },
        success_url: `${req.headers.origin || 'http://localhost:3000'}/index.html?session_id={CHECKOUT_SESSION_ID}&status=success&wo=${workOrderId}`,
        cancel_url: `${req.headers.origin || 'http://localhost:3000'}/index.html?status=cancelled&wo=${workOrderId}`,
      });

      return res.json({
        success: true,
        workOrderId,
        requiresPayment: true,
        checkoutUrl: session.url
      });
    }

    // Free donation / recycling track
    return res.json({
      success: true,
      workOrderId,
      requiresPayment: false,
      message: 'Work order confirmed. Pre-paid postal label dispatched.'
    });

  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// API: Stripe Webhook to Confirm Payments & Update Status
// -------------------------------------------------------------
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const workOrderId = session.metadata?.workOrderId;
    console.log(`Payment confirmed for Work Order ${workOrderId}. Amount: $${session.amount_total / 100}`);

    const wo = db.workOrders.find(w => w.id === workOrderId);
    if (wo) {
      wo.status = 'paid_diagnostic_and_label_issued';
      wo.stripePaymentIntent = session.payment_intent;
    }
  }

  res.json({ received: true });
});

// -------------------------------------------------------------
// API: Check Work Order Status & Estimate Review
// -------------------------------------------------------------
app.get('/api/work-orders/:id', (req, res) => {
  const wo = db.workOrders.find(w => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found.' });
  res.json(wo);
});


// -------------------------------------------------------------
// API: Dispatch Shipping Label for Work Order
// -------------------------------------------------------------
app.post('/api/shipping/generate-label', async (req, res) => {
  try {
    const { workOrderId, clientDetails, serviceType } = req.body;
    const labelData = await shippingService.generateInboundLabel(clientDetails, serviceType);

    // Send confirmation email
    await notificationService.sendOrderConfirmation(clientDetails.email, { workOrderId, ...clientDetails, serviceType }, labelData.labelUrl);

    res.json({ success: true, ...labelData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// API: Generate Cloud Vault Download Link for Recovered Data
// -------------------------------------------------------------
app.post('/api/vault/generate-download', async (req, res) => {
  try {
    const { workOrderId, archiveFilename, clientPhone } = req.body;
    const vault = await storageService.generateSecureDownloadUrl(workOrderId, archiveFilename);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Send PIN out-of-band via SMS
    await notificationService.sendDataRecoveryPasskey(clientPhone, workOrderId, pin);

    res.json({ success: true, ...vault });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------------------------------------
// API: Public Work Order Tracking & Milestone Inspection
// -------------------------------------------------------------
app.get('/api/work-orders/:id/track', (req, res) => {
  const query = req.params.id.trim().toUpperCase();
  const wo = db.workOrders.find(w => w.id.toUpperCase() === query || (w.client && w.client.phone && w.client.phone.includes(query)));

  if (!wo) {
    // Return mock active order if querying default demo
    return res.json({
      success: true,
      id: query,
      deviceModel: 'Lenovo ThinkPad T480',
      client: { fullName: 'Miriam ben Joseph', phone: '(555) 234-8901' },
      status: 'diagnostic_estimate_ready',
      estimate: {
        partsCost: 3500,
        laborCost: 6000,
        diagnosticDepositCredit: 5000,
        netBalanceDue: 4500,
        faults: 'Shorted internal DC power jack; degraded thermal paste; NVMe drive healthy.',
        status: 'pending_client_approval'
      },
      disposition: 'donate_to_guild',
      milestones: [
        { step: 1, title: 'Work Order Submitted & Label Dispatched', completed: true, timestamp: '2026-09-05T10:14:00Z' },
        { step: 2, title: 'Inbound Parcel Received at Church Tech Annex', completed: true, timestamp: '2026-09-07T14:45:00Z' },
        { step: 3, title: 'Hardware Diagnostics & Written Estimate Authored', completed: true, timestamp: '2026-09-08T11:30:00Z' },
        { step: 4, title: 'Client Estimate Decision / Repair Bench', active: true },
        { step: 5, title: 'Quality Assurance & Return Shipment / Donation Impact', pending: true }
      ]
    });
  }

  res.json({ success: true, ...wo });
});

// -------------------------------------------------------------
// API: Customer Online Approval / Decline of Written Estimate
// -------------------------------------------------------------
app.post('/api/work-orders/:id/estimate-decision', (req, res) => {
  const { decision } = req.body; // 'approved' or 'declined'
  const woId = req.params.id;
  console.log(`[Estimate Decision] Order ${woId}: ${decision}`);

  res.json({
    success: true,
    workOrderId: woId,
    decision,
    message: decision === 'approved' 
      ? 'Estimate approved. Technician scheduled for component repair.' 
      : 'Estimate declined. Device allocated according to your pre-selected disposition.'
  });
});

// -------------------------------------------------------------
// API: Generate / Retrieve Official Certificates & Receipts
// -------------------------------------------------------------
app.get('/api/certificates/:id', (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // 'sanitization' or 'tax_receipt'

  if (type === 'tax_receipt') {
    const cert = certificateEngine.generateTaxReceipt({ id, client: { fullName: 'Valued Donor' } }, 15000);
    return res.json(cert);
  }

  const cert = certificateEngine.generateSanitizationCertificate({ id, client: { fullName: 'Valued Client' }, deviceModel: 'Client Hardware' }, 'Apprentice Cohort #4');
  res.json(cert);
});


// -------------------------------------------------------------
// API: Volunteer Application Intake (How/When/Where/Why)
// -------------------------------------------------------------
app.post('/api/volunteers/onboard', (req, res) => {
  const { fullName, email, phone, locationPreference, roles, schedule, experience, whyStatement } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }

  const volId = 'VOL-' + Date.now().toString(36).toUpperCase();
  console.log(`[Volunteer Onboarding] New application received: ${volId} - ${fullName} (${email})`);
  console.log(`   Location: ${locationPreference} | Schedule: ${schedule} | Roles: ${JSON.stringify(roles)}`);
  console.log(`   Why: ${whyStatement}`);

  res.json({
    success: true,
    volunteerId: volId,
    message: 'Application received with agape. Orientation coordinator will contact within 48 hours.'
  });
});

app.listen(PORT, () => {
  console.log(`ONE E-Waste Emporia server running on http://localhost:${PORT}`);
});
