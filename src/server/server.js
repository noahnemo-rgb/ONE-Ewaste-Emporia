/**
 * ONE E-Waste Emporia & Restorative Guild — Backend Server
 * Express.js with Stripe Checkout, Webhooks, and Work Order APIs
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

app.listen(PORT, () => {
  console.log(`ONE E-Waste Emporia server running on http://localhost:${PORT}`);
});
