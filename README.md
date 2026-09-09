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
│   ├── index.html
│   ├── volunteer.html
│   ├── store.html              # NEW: Community upcycled hardware storefront & catalog
│   ├── enterprise.html         # NEW: Corporate, school & church fleet decommissioning ITAD portal
│   ├── passport.html           # NEW: Apprentice skills passport & portfolio transcript
│   ├── triage-assistant.html   # NEW: Guided diagnostic troubleshooter & teaching decision tree          # NEW: Dedicated volunteer onboarding portal (The 4 W's: How, When, Where, Why)              # Customer landing page & work order wizard
│   ├── track.html              # NEW: Customer self-service tracking & estimate approval portal
│   ├── certificate.html        # NEW: Verifiable NIST 800-88 certificate & 501(c)(3) tax receipt
│   ├── admin.html              # Apprentice & supervisor triage workbench UI
│   ├── terms.html              # Terms of service & $50 diagnostic agreement
│   ├── privacy.html            # Strict data privacy & user information policy
│   ├── cookies.html            # Minimalist cookie policy
│   └── assets/
│       └── one_logo.jpg        # Liquid glass ONE Church emblem
├── src/
│   ├── server/
│   │   ├── server.js           # Express API, Stripe checkout & webhook handler
│   │   ├── certificates.js     # NEW: NIST 800-88 & 501(c)(3) certificate engine
│   │   ├── shipping.js         # EasyPost / USPS automated return label service
│   │   ├── notifications.js    # Resend email & Twilio out-of-band SMS service
│   │   └── storage.js          # Encrypted cloud vault pre-signed URL generator
│   └── database/
│       ├── schema.sql          # SQL schema (PostgreSQL / SQLite)
│       └── schema.prisma       # Prisma ORM schema
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


---

## The Volunteer Guild Portal (`public/volunteer.html`)

Designed around the **How, When, Where, and Why** framework:
- **WHY:** Grounded in universal agape, restorative justice for returning citizens, empowerment of disabled technicians, and zero-landfill stewardship.
- **HOW:** Structured onboarding tracks (Hardware Diagnostics, Linux/Software, Mentorship/Life Coaching, Logistics/Sorting).
- **WHEN:** Flexible shifts including Tuesday/Thursday Morning Guild, Wednesday Evening Fellowship & Solder Lab, and 1st/3rd E-Waste Saturday Community Drives.
- **WHERE:** Tech Sanctuary Annex (Atlanta, GA), Regional Drop-off Satellites, and Remote Virtual Lab.


---

## Vocational Guild & Educational Growth Systems

1. **Digital "Apprentice Passport" (`public/passport.html`):**
   - Tracks each apprentice's logged repair hours, NIST 800-88 sanitizations, and Linux computer refurbishments.
   - Measures progress across five CompTIA A+ core competency domains.
   - Includes a print-optimized **Employer Transcript & Ministry Attestation** that returning citizens and disabled apprentices can take directly to commercial IT hiring managers.

2. **Interactive Triage Decision Assistant (`public/triage-assistant.html`):**
   - A step-by-step diagnostic tree that guides apprentices through bench symptom analysis (Dead Power / Shorted Rails, No POST, Memory Failures, Storage Diagnostics, Thermal Shutdowns, and Liquid Spill Recovery).
   - Provides exact laboratory Standard Operating Procedures (SOPs) and voltage checkpoints.


---

## Sustainable Revenue & Community Hardware Systems

1. **The Community Upcycled Storefront (`public/store.html`):**
   - High-performance, apprentice-refurbished laptops, desktops, and mini PCs ($35 to $195).
   - 100% of proceeds fund living-wage stipends for returning citizens and disabled apprentices.
   - Pre-installed with Linux Mint or Windows 11 Pro Refurbisher licenses.
   - Full 90-Day Guild Warranty and NIST SP 800-88 cryptographic drive wipe proof.

2. **Corporate & Fleet Decommissioning Portal (`public/enterprise.html`):**
   - IT Asset Disposition (ITAD) for companies, schools, and churches retiring 10 to 500+ machines.
   - Free dock-to-dock freight pickup, serialized NIST SP 800-88 sanitization certificates, and 501(c)(3) equipment tax contribution receipts.
   - Interactive Fleet Social Impact & Tax Valuation Calculator (calculates diverted pounds of e-waste, carbon offsets, and apprentice hours funded).
