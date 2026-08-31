-- Phase 5: AI Dynamic Pricing & Diaspora Surge Engine Schema

-- 1. Diaspora Calendar Events & Seasonal Surges
CREATE TABLE IF NOT EXISTS diaspora_calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    surge_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.50, -- e.g. 1.85x for Dec in Ghana
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Infrastructure Badge Pricing Multipliers
CREATE TABLE IF NOT EXISTS badge_pricing_multipliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_type VARCHAR(50) UNIQUE NOT NULL,
    premium_percentage INT NOT NULL, -- e.g. 15 for +15%
    description VARCHAR(255)
);

-- 3. Dynamic Price Calculation Audit Log
CREATE TABLE IF NOT EXISTS dynamic_price_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    base_price_usd NUMERIC(10,2) NOT NULL,
    calculated_price_usd NUMERIC(10,2) NOT NULL,
    surge_multiplier NUMERIC(3,2) DEFAULT 1.00,
    badge_premium_percent INT DEFAULT 0,
    active_event VARCHAR(100),
    calculation_breakdown JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed African Diaspora Calendar Events
INSERT INTO diaspora_calendar_events (event_name, city, start_date, end_date, surge_multiplier, description)
VALUES 
    ('December in Ghana (Detty December)', 'Accra', '2026-12-01', '2027-01-15', 1.85, 'Annual diaspora homecoming surge, Afro Nation, Afrochella, high luxury rental demand'),
    ('Lagos Tech Fest & Art X', 'Lagos', '2026-10-15', '2026-11-15', 1.40, 'Continental tech conferences & luxury short stay surge in Victoria Island/Lekki'),
    ('Nairobi Safari High Season', 'Nairobi', '2026-07-01', '2026-09-30', 1.35, 'Great Migration peak tourism, expatriate corporate relocations')
ON CONFLICT DO NOTHING;

-- Seed Badge Multipliers
INSERT INTO badge_pricing_multipliers (badge_type, premium_percentage, description)
VALUES 
    ('SOLAR_VERIFIED', 18, 'Guaranteed 24/7 power autonomy via hybrid solar/inverter'),
    ('STARLINK_VERIFIED', 12, 'High-throughput low-latency satellite internet (180+ Mbps)'),
    ('BOREHOLE_VERIFIED', 8, 'Independent uninterrupted filtered water security'),
    ('SMART_ACCESS_VERIFIED', 5, 'Keyless digital lock access and zero check-in delays')
ON CONFLICT DO NOTHING;
