# ONE E-Waste Emporia — Full-Service System

> **Diagnostic Repairs, Restorative Rehabilitation Guild, Upcycling & Data Sanctuary**  
> *Sponsored by Our New Era (ONE) Church* — Grounded in the original, unchanged *agape* teachings of Yeshua ben Yosef.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stripe Integrated](https://img.shields.io/badge/Payments-Stripe%20Checkout%20Ready-6366f1.svg)](STRIPE_SETUP.md)
[![NIST SP 800-88](https://img.shields.io/badge/Sanitization-NIST%20800--88-purple.svg)](#data-sanitization)
[![Fair-Chance Vocational Guild](https://img.shields.io/badge/Vocational%20Rehab-Fair--Chance%20%26%20Adaptive-teal.svg)](#the-vocational-rehabilitation-guild)

---

## What's New in this Release

1. **Full-Service Diagnostic & Repair Pipeline:**
   - **$50 Non-Refundable Diagnostic Deposit:** Customers submit devices for technical inspection and written estimates. If the repair is approved, the $50 deposit is credited toward the final invoice.
2. **Work Order Disposition Directives:**
   - Customers explicitly choose what happens if their machine is unrepairable or if they decline the estimate:
     - **Option A:** Donate to ONE Vocational Rehabilitation Guild (tax-deductible).
     - **Option B:** Return unrepaired, cryptographically wiped (NIST SP 800-88).
     - **Option C:** Return unrepaired, as-is (unwiped).
3. **Charitable Monetary Contribution Add-On:**
   - Interactive donation pills ($15, $35, $50, $100) integrated into checkout to directly fund apprentice living wages and equipment grants.
4. **Complete Policy Suite:**
   - `terms.html`: Terms of Service, liability caps, repair agreement, and abandoned property clauses.
   - `privacy.html`: Comprehensive privacy policy adhering to CCPA/GDPR and strict non-monetization of user data.
   - `cookies.html`: Minimalist cookie transparency policy.
5. **Full Backend Architecture:**
   - Express.js API server (`src/server/server.js`) with Stripe Checkout sessions and Webhook handler.
   - Relational Database Schema (`src/database/schema.sql` & Prisma ORM model) tracking work orders, diagnostic estimates, payments, and custody audit logs.

---

## Project Structure

```
ONE-Ewaste-Emporia/
├── public/
│   ├── index.html              # Main interactive landing page & work order wizard
│   ├── admin.html              # Apprentice & Supervisor Triage Workbench UI
│   ├── terms.html              # Terms of Service & Diagnostic Repair Agreement
│   ├── privacy.html            # Privacy Policy & User Data Handling
│   ├── cookies.html            # Cookie Policy
│   └── assets/
│       └── one_logo.jpg        # ONE Church liquid glass emblem
├── src/
│   ├── server/
│   │   ├── server.js           # Express API, Stripe Checkout & Webhook handler
│   │   ├── shipping.js         # EasyPost / USPS automated return label service
│   │   ├── notifications.js    # Resend email & Twilio out-of-band SMS service
│   │   └── storage.js          # Encrypted Cloud Vault pre-signed URL generator
│   └── database/
│       ├── schema.sql          # SQL Schema (PostgreSQL / SQLite)
│       └── schema.prisma       # Prisma ORM Schema
├── .env.example                # Configuration template
├── package.json                # Node.js dependencies & scripts
├── STRIPE_SETUP.md             # Stripe merchant account activation walkthrough
├── DATA_RECOVERY_PROTOCOL.md   # Secure data return, encryption & custody protocol
├── WORKSHOP_SAFETY_AND_APPRENTICE_SOP.md # Apprentice syllabus, triage & safety SOP
└── README.md                   # System documentation
```

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your Stripe test keys to .env

# 3. Start development server
npm start
# Open http://localhost:3000 in your browser
```

---

## Deploying to Vercel

1. Commit and push the project to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: full-service repair system, stripe checkout & policy pages"
   git push origin main
   ```
2. In Vercel, set the environment variables from `.env.example` in your Project Settings.
3. Vercel automatically deploys both the static pages and the backend API routes.

---

&copy; 2026 Our New Era (ONE) Church. All rights reserved.
