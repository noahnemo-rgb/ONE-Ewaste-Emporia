# Stripe Activation & Backend Setup Guide
## ONE E-Waste Emporia & Restorative Guild

This guide outlines how to activate your **Stripe** merchant account and connect it to your **ONE E-Waste Emporia** backend to accept:
1. Non-refundable $50 initial diagnostic deposits.
2. Final repair invoice settlements (with the $50 credited back).
3. Voluntary tax-deductible charitable donations.

---

### Step 1: Create or Sign In to Stripe

1. Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Enter your email (e.g. `noahnemo@gmail.com` or `admin@onechurch.global`).
3. Under **Business Type**, select **Non-profit organization** (or Religious Organization) if operating under Our New Era Church's 501(c)(3), or LLC/Sole Proprietorship if operating as a social enterprise.
4. Complete the identity verification and link the church's depository bank account for automated payouts.

---

### Step 2: Retrieve API Keys

1. In the Stripe Dashboard, make sure you are in **Test Mode** (toggle on the top right) during development.
2. Navigate to **Developers** &rarr; **API Keys**.
3. Copy:
   - **Publishable Key:** Starts with `pk_test_...`
   - **Secret Key:** Starts with `sk_test_...`
4. Paste these into your `.env` file:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

### Step 3: Configure Stripe Webhooks

Webhooks notify your backend whenever a customer completes checkout so the server can automatically change the work order status and email the pre-paid shipping label.

1. In the Stripe Dashboard, go to **Developers** &rarr; **Webhooks**.
2. Click **Add endpoint**.
3. Set the endpoint URL:
   - On Vercel / Production: `https://your-domain.vercel.app/api/webhooks/stripe`
   - For local testing: Use the Stripe CLI:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
4. Under **Events to send**, select `checkout.session.completed`.
5. Copy the **Signing Secret** (`whsec_...`) and add it to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

### Step 4: Database Deployment

The database schema in `src/database/schema.sql` can be deployed in one click to:
- **Supabase (PostgreSQL):** Open the SQL Editor in Supabase and run `src/database/schema.sql`.
- **Neon / Railway / Render:** Connect with `DATABASE_URL` and run `npx prisma migrate dev`.
