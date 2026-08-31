-- Phase 6: Communication Engine & Multi-Property Host Portfolio Analytics Schema

-- 1. Communication Message Logs (SMS & WhatsApp Two-Way Dispatch)
CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(20) NOT NULL, -- 'WHATSAPP' or 'SMS'
    direction VARCHAR(10) NOT NULL, -- 'OUTBOUND' or 'INBOUND'
    recipient_phone VARCHAR(20) NOT NULL,
    sender_phone VARCHAR(20) NOT NULL DEFAULT '+233550000000',
    message_type VARCHAR(50) NOT NULL, -- 'CARETAKER_PULSE_PROMPT', 'TENANT_OUTAGE_NOTICE', 'DIESEL_DISPATCH_ALERT'
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'READ'
    external_provider_id VARCHAR(100),
    property_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Host Portfolio Metrics & Tax Withholding Records
CREATE TABLE IF NOT EXISTS host_tax_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL,
    tax_authority VARCHAR(50) NOT NULL, -- 'GRA_GHANA' (8%) or 'FIRS_NIGERIA' (10%)
    gross_revenue_usd NUMERIC(12,2) NOT NULL,
    withholding_tax_usd NUMERIC(12,2) NOT NULL,
    tax_rate_percent NUMERIC(4,2) NOT NULL,
    reporting_period VARCHAR(20) NOT NULL, -- e.g. '2026-Q3'
    status VARCHAR(20) DEFAULT 'FILED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed sample communication history
INSERT INTO communication_logs (channel, direction, recipient_phone, message_type, body, status)
VALUES
    ('WHATSAPP', 'OUTBOUND', '+233551234999', 'CARETAKER_PULSE_PROMPT', 'Flex-Living Morning Pulse: Please confirm ECG grid, generator diesel, and borehole water status for Accra Luxury Apt.', 'DELIVERED'),
    ('SMS', 'OUTBOUND', '+233244111222', 'TENANT_OUTAGE_NOTICE', 'Flex-Living Reassurance: ECG blackout detected in Cantonments. Your solar inverter backup is active. Zero downtime guaranteed.', 'DELIVERED')
ON CONFLICT DO NOTHING;
