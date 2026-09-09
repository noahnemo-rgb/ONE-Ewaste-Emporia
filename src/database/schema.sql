-- ==========================================================
-- ONE E-Waste Emporia — Core Database Schema
-- Sponsoring Organization: Our New Era (ONE) Church
-- Compatible with PostgreSQL 14+ and SQLite 3.35+
-- ==========================================================

-- 1. Users / Donors / Clients Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(50) NOT NULL,
    shipping_zip VARCHAR(20) NOT NULL,
    is_reentry_apprentice BOOLEAN DEFAULT FALSE,
    is_church_member BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Work Orders Table
-- Tracks client device lifecycle, diagnostic deposit, and disposition instructions
CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(64) PRIMARY KEY,                -- e.g. WO-2026-0001
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,         -- 'repair_diagnostic', 'donation_upcycle', 'data_recovery', 'eco_recycle'
    device_category VARCHAR(50) NOT NULL,      -- 'laptop', 'desktop', 'phone', 'storage_drive', 'mixed_box'
    device_model_desc TEXT,
    device_serial_number VARCHAR(100),
    reported_issue TEXT,

    -- Diagnostic Flat Rate & Estimates
    requires_diagnostic BOOLEAN DEFAULT FALSE,
    diagnostic_fee_amount INTEGER DEFAULT 5000, -- in cents: $50.00
    diagnostic_fee_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'waived'
    stripe_diagnostic_session_id VARCHAR(255),

    -- Customer Selected Disposition if repair declined / unrepairable
    unrepaired_disposition VARCHAR(50) NOT NULL DEFAULT 'donate_to_guild',
    -- Values:
    -- 'donate_to_guild': Donate to Vocational Rehab Guild for apprentice teardown/upcycling
    -- 'return_wiped': Return to customer sanitized (NIST 800-88) - customer pays postage
    -- 'return_unwiped': Return to customer as-is - customer pays postage
    -- 'recycle_only': Zero-landfill dismantle to R2v3 downstream

    -- Tracking & Status
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    -- Values: 'submitted', 'in_transit_to_annex', 'received_triage', 'diagnostic_in_progress',
    --         'estimate_pending_approval', 'repair_in_progress', 'sanitized', 'completed_shipped', 'donated'

    inbound_tracking_number VARCHAR(100),
    outbound_tracking_number VARCHAR(100),
    assigned_apprentice_id VARCHAR(64),        -- Vocational Guild student handling device
    supervisor_id VARCHAR(64),

    -- Monetary Donation Add-on
    charitable_donation_amount INTEGER DEFAULT 0, -- in cents

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Diagnostic Estimates Table
CREATE TABLE IF NOT EXISTS diagnostic_estimates (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    technician_notes TEXT NOT NULL,
    hardware_faults_found TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    parts_cost INTEGER NOT NULL DEFAULT 0,      -- in cents
    labor_cost INTEGER NOT NULL DEFAULT 0,      -- in cents
    diagnostic_credit INTEGER NOT NULL DEFAULT 5000, -- $50 credited back if repair approved
    total_approved_cost INTEGER NOT NULL,      -- parts + labor - diagnostic_credit
    estimate_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'declined', 'expired'
    sent_to_customer_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Payments & Charitable Contributions
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) REFERENCES work_orders(id),
    user_id VARCHAR(64) REFERENCES users(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,      -- 'diagnostic_fee', 'repair_balance', 'charitable_donation', 'return_postage'
    amount INTEGER NOT NULL,                    -- in cents
    currency VARCHAR(10) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,                -- 'succeeded', 'refunded', 'failed'
    tax_receipt_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Chain of Custody & Sanitization Audit Logs
CREATE TABLE IF NOT EXISTS custody_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,           -- 'package_received', 'opened_inspected', 'diagnostic_begun', 'wipe_performed', 'shipped'
    performed_by VARCHAR(100) NOT NULL,
    details TEXT,
    nist_wipe_method VARCHAR(50),               -- e.g. 'NIST_800_88_CLEAR', 'NIST_800_88_PURGE'
    certificate_hash VARCHAR(128),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wo_user ON work_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wo_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_tx_wo ON transactions(work_order_id);

-- 6. Volunteer Guild Applications & Onboarding Table
CREATE TABLE IF NOT EXISTS volunteers (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location_preference VARCHAR(50) NOT NULL,  -- 'annex', 'popups', 'remote', 'hybrid'
    roles_interested TEXT NOT NULL,            -- JSON array of selected roles
    schedule_availability VARCHAR(50) NOT NULL,-- 'weekdays_mornings', 'wednesday_evenings', 'saturday_drives', etc.
    experience_level VARCHAR(50) NOT NULL,     -- 'beginner', 'hobbyist', 'professional', 'mentor_only'
    why_statement TEXT NOT NULL,
    agreed_to_code_of_ethics BOOLEAN DEFAULT TRUE,
    orientation_status VARCHAR(50) DEFAULT 'applied', -- 'applied', 'orientation_scheduled', 'active_guild_member'
    assigned_station VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Vocational Apprentices & CompTIA A+ Competency Tracking
CREATE TABLE IF NOT EXISTS apprentices (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    cohort_number INTEGER DEFAULT 1,
    program_track VARCHAR(50) NOT NULL DEFAULT 'fair_chance_reentry', -- 'fair_chance_reentry', 'disability_vocational', 'youth_guild'
    mentor_supervisor_id VARCHAR(64),
    hours_logged INTEGER DEFAULT 0,
    comptia_core1_readiness INTEGER DEFAULT 0, -- percentage 0 - 100
    comptia_core2_readiness INTEGER DEFAULT 0,
    devices_repaired_count INTEGER DEFAULT 0,
    drives_sanitized_count INTEGER DEFAULT 0,
    laptops_gifted_count INTEGER DEFAULT 0,
    supervisor_endorsement_notes TEXT,
    graduation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apprentice_practicum_logs (
    id VARCHAR(64) PRIMARY KEY,
    apprentice_id VARCHAR(64) NOT NULL REFERENCES apprentices(id) ON DELETE CASCADE,
    work_order_id VARCHAR(64) REFERENCES work_orders(id),
    task_category VARCHAR(100) NOT NULL, -- 'dc_jack_repair', 'memtest86', 'thermal_paste', 'nist_sanitization', 'linux_install'
    hours_spent NUMERIC(4, 2) NOT NULL,
    supervisor_signoff BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Upcycled Community Storefront Inventory & Orders
CREATE TABLE IF NOT EXISTS store_inventory (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,              -- 'laptop', 'desktop', 'storage', 'accessory'
    specs_summary VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,               -- e.g. 16500 = $165.00
    quantity_in_stock INTEGER NOT NULL DEFAULT 1,
    os_installed VARCHAR(100) DEFAULT 'Linux Mint 21.3 Cinnamon',
    refurbished_by_apprentice_id VARCHAR(64) REFERENCES apprentices(id),
    nist_wipe_hash VARCHAR(128),
    warranty_days INTEGER DEFAULT 90,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT NOT NULL,
    items_json TEXT NOT NULL,                   -- JSON array of purchased inventory items
    total_amount_cents INTEGER NOT NULL,
    stripe_session_id VARCHAR(255),
    fulfillment_status VARCHAR(50) DEFAULT 'paid_pending_shipment',
    outbound_tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Corporate & Church Fleet Decommissioning (ITAD) Intakes
CREATE TABLE IF NOT EXISTS enterprise_decommissions (
    id VARCHAR(64) PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    facility_address TEXT NOT NULL,
    estimated_quantity VARCHAR(50) NOT NULL,    -- '10-25', '25-50', '50-100', '100-250', '250+'
    primary_hardware_type VARCHAR(50) NOT NULL, -- 'laptops', 'desktops', 'mixed', 'servers'
    additional_notes TEXT,
    proposal_status VARCHAR(50) DEFAULT 'inquiry_received', -- 'inquiry_received', 'dock_pickup_scheduled', 'in_annex_triage', 'completed_certified'
    master_sanitization_cert_id VARCHAR(64),
    tax_receipt_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
