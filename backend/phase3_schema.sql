-- Phase 3: Hybrid Non-IoT Fallback, WhatsApp Caretaker Engine & Flex-Advance

-- 1. Caretaker Daily Pulse Checks (via WhatsApp)
CREATE TABLE IF NOT EXISTS caretaker_pulse_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    caretaker_phone VARCHAR(20) NOT NULL,
    grid_power_status VARCHAR(20) DEFAULT 'NORMAL',
    generator_fuel_status VARCHAR(20) DEFAULT 'FULL',
    water_tank_status VARCHAR(20) DEFAULT 'NORMAL',
    reported_via VARCHAR(20) DEFAULT 'WHATSAPP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tenant Outage Claims & Human-in-the-Loop SLA Timers
CREATE TABLE IF NOT EXISTS tenant_outage_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    outage_type VARCHAR(50) NOT NULL,
    claim_lat NUMERIC(9,6),
    claim_lng NUMERIC(9,6),
    geofence_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'INVESTIGATING',
    sla_window_minutes INT DEFAULT 120,
    sla_timer_expires_at TIMESTAMP NOT NULL,
    resolution_notes TEXT,
    refund_amount_usd NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 3. Host Escrow & 15% SLA Reserve Protection
CREATE TABLE IF NOT EXISTS host_escrows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL,
    booking_id UUID NOT NULL,
    property_id UUID NOT NULL,
    total_booking_usd NUMERIC(10,2) NOT NULL,
    escrow_reserve_15pct NUMERIC(10,2) NOT NULL,
    deducted_refunds_usd NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'HELD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    release_scheduled_at TIMESTAMP NOT NULL
);

-- 4. Flex-Advance Rental Financing Engine
CREATE TABLE IF NOT EXISTS flex_advances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    advance_amount_usd NUMERIC(10,2) NOT NULL,
    monthly_repayment_usd NUMERIC(10,2) NOT NULL,
    tenure_months INT NOT NULL DEFAULT 6,
    credit_score INT NOT NULL,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_pulse_checks_prop ON caretaker_pulse_checks(property_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenant_claims_prop ON tenant_outage_claims(property_id, status);
CREATE INDEX IF NOT EXISTS idx_host_escrows_prop ON host_escrows(property_id);
CREATE INDEX IF NOT EXISTS idx_flex_advances_user ON flex_advances(user_id);
