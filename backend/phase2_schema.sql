-- Phase 2 Database Migration: Scout Audits, Badges, IoT Devices & SLA Engine

-- Ensure badges column on listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flex_trust_score INT DEFAULT 70;

-- 1. Scout Audits & Tasks
CREATE TABLE IF NOT EXISTS scout_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    scout_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    checklist_data JSONB DEFAULT '{}'::jsonb,
    awarded_badges JSONB DEFAULT '[]'::jsonb,
    base_payout_usd NUMERIC(10,2) DEFAULT 25.00,
    bonus_payout_usd NUMERIC(10,2) DEFAULT 0.00,
    total_payout_usd NUMERIC(10,2) DEFAULT 25.00,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. IoT Devices
CREATE TABLE IF NOT EXISTS iot_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    device_key VARCHAR(100) UNIQUE NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. IoT Telemetry Events (Time-Series)
CREATE TABLE IF NOT EXISTS iot_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    device_id UUID REFERENCES iot_devices(id),
    grid_power_status VARCHAR(20) DEFAULT 'ONLINE',
    generator_status VARCHAR(20) DEFAULT 'OFF',
    water_pressure_psi NUMERIC(6,2) DEFAULT 45.0,
    internet_latency_ms NUMERIC(6,2) DEFAULT 24.0,
    internet_speed_mbps NUMERIC(6,2) DEFAULT 150.0,
    lock_state VARCHAR(20) DEFAULT 'LOCKED',
    battery_level INT DEFAULT 98,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SLA Outage Breaches
CREATE TABLE IF NOT EXISTS sla_breaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    breach_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    outage_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    outage_resolved_at TIMESTAMP,
    duration_minutes INT DEFAULT 0,
    refund_recommended_usd NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_scout_tasks_property ON scout_tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_scout_tasks_status ON scout_tasks(status);
CREATE INDEX IF NOT EXISTS idx_iot_telemetry_property_time ON iot_telemetry(property_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sla_breaches_property_status ON sla_breaches(property_id, status);
