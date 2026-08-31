require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

// Auto-run schema migration on boot
async function initDb() {
  try {
    const schemaPath = path.join(__dirname, '../../phase5_schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(sql);
      console.log('✅ Phase 5 Schema Auto-Migrated (diaspora_calendar_events & badge_pricing_multipliers ready)');
    }
  } catch (err) {
    console.error('Warning: Schema auto-migration notice:', err.message);
  }
}

initDb();

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'ai-dynamic-pricing-and-diaspora-engine' });
});

/**
 * GET /v1/pricing/diaspora-events
 * Returns active seasonal calendar events across Accra, Lagos, Nairobi
 */
app.get('/v1/pricing/diaspora-events', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM diaspora_calendar_events ORDER BY start_date ASC'
    );
    res.status(200).json({
      events: result.rows
    });
  } catch (err) {
    console.error('Error fetching diaspora events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/pricing/calculate/:propertyId
 * Dynamic Yield & Surge Calculator
 * Query params: checkIn (YYYY-MM-DD), checkOut (YYYY-MM-DD), currency (USD, GHS, NGN)
 */
app.get('/v1/pricing/calculate/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { checkIn = '2026-12-20', checkOut = '2027-01-05', currency = 'USD' } = req.query;

    // 1. Fetch Property Baseline
    const propRes = await pool.query(
      'SELECT id, title, price_per_night, ST_Y(geo_location::geometry) as lat, ST_X(geo_location::geometry) as lng FROM listings WHERE id = $1',
      [propertyId]
    );

    if (propRes.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propRes.rows[0];
    const baseDailyPriceUsd = parseFloat(property.price_per_night) || 120.0;
    const baseMonthlyPriceUsd = baseDailyPriceUsd * 30;

    // 2. Fetch Active Verified Badges
    const badgeRes = await pool.query(
      "SELECT awarded_badges FROM scout_tasks WHERE property_id = $1 AND status = 'COMPLETED' ORDER BY created_at DESC LIMIT 1",
      [propertyId]
    );

    let activeBadges = ['SOLAR_VERIFIED', 'STARLINK_VERIFIED', 'BOREHOLE_VERIFIED', 'SMART_ACCESS_VERIFIED'];
    if (badgeRes.rows.length > 0 && badgeRes.rows[0].awarded_badges) {
      activeBadges = badgeRes.rows[0].awarded_badges;
    }

    // 3. Compute Infrastructure Badge Premiums
    let totalBadgePremiumPercent = 0;
    const badgeBreakdown = [];
    
    if (activeBadges.includes('SOLAR_VERIFIED')) {
      totalBadgePremiumPercent += 18;
      badgeBreakdown.push({ badge: 'SOLAR_VERIFIED', premium: '+18%', description: 'Guaranteed 24/7 solar autonomy' });
    }
    if (activeBadges.includes('STARLINK_VERIFIED')) {
      totalBadgePremiumPercent += 12;
      badgeBreakdown.push({ badge: 'STARLINK_VERIFIED', premium: '+12%', description: '180 Mbps Starlink low-latency edge' });
    }
    if (activeBadges.includes('BOREHOLE_VERIFIED')) {
      totalBadgePremiumPercent += 8;
      badgeBreakdown.push({ badge: 'BOREHOLE_VERIFIED', premium: '+8%', description: 'Uninterrupted filtered borehole water' });
    }
    if (activeBadges.includes('SMART_ACCESS_VERIFIED')) {
      totalBadgePremiumPercent += 5;
      badgeBreakdown.push({ badge: 'SMART_ACCESS_VERIFIED', premium: '+5%', description: 'Keyless smart digital lock' });
    }

    // 4. Check for Diaspora Calendar Surge (e.g. December in Ghana)
    const surgeRes = await pool.query(
      `SELECT * FROM diaspora_calendar_events 
       WHERE (start_date <= $1::date AND end_date >= $1::date)
          OR (start_date <= $2::date AND end_date >= $2::date)
       ORDER BY surge_multiplier DESC LIMIT 1`,
      [checkIn, checkOut]
    );

    let activeSurgeEvent = null;
    let surgeMultiplier = 1.0;

    if (surgeRes.rows.length > 0) {
      activeSurgeEvent = surgeRes.rows[0].event_name;
      surgeMultiplier = parseFloat(surgeRes.rows[0].surge_multiplier);
    }

    // 5. Final Dynamic Price Formula: Base * (1 + BadgePremium) * SurgeMultiplier
    const badgeMultiplier = 1 + (totalBadgePremiumPercent / 100);
    const dynamicDailyUsd = Math.round(baseDailyPriceUsd * badgeMultiplier * surgeMultiplier);
    const dynamicMonthlyUsd = Math.round(baseMonthlyPriceUsd * badgeMultiplier * surgeMultiplier);

    // Currency Formatting Helper
    const formatCurrency = (amountUsd) => {
      if (currency === 'GHS') return { currency: 'GHS', amount: Math.round(amountUsd * 15.2) };
      if (currency === 'NGN') return { currency: 'NGN', amount: Math.round(amountUsd * 1600) };
      return { currency: 'USD', amount: amountUsd };
    };

    const calculatedPrice = formatCurrency(dynamicDailyUsd);
    const calculatedMonthly = formatCurrency(dynamicMonthlyUsd);

    // Log the calculation
    await pool.query(
      `INSERT INTO dynamic_price_logs
       (property_id, base_price_usd, calculated_price_usd, surge_multiplier, badge_premium_percent, active_event, calculation_breakdown)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        propertyId, 
        baseDailyPriceUsd, 
        dynamicDailyUsd, 
        surgeMultiplier, 
        totalBadgePremiumPercent, 
        activeSurgeEvent, 
        JSON.stringify({ badgeBreakdown, checkIn, checkOut })
      ]
    );

    res.status(200).json({
      propertyId,
      title: property.title,
      period: { checkIn, checkOut },
      pricing: {
        daily: calculatedPrice,
        monthly: calculatedMonthly,
        baseDailyUsd: baseDailyPriceUsd,
        surgeMultiplier,
        activeSurgeEvent: activeSurgeEvent || 'Standard Season (1.0x)',
        totalBadgePremium: `+${totalBadgePremiumPercent}%`,
        badgeBreakdown
      },
      yieldOptimization: {
        unverifiedStandardMonthlyUsd: baseMonthlyPriceUsd,
        flexVerifiedDynamicMonthlyUsd: dynamicMonthlyUsd,
        netRevenueLiftPercent: Math.round(((dynamicMonthlyUsd - baseMonthlyPriceUsd) / baseMonthlyPriceUsd) * 100),
        annualizedHostBenefitUsd: (dynamicMonthlyUsd - baseMonthlyPriceUsd) * 12
      }
    });
  } catch (err) {
    console.error('Error calculating dynamic pricing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/pricing/yield-analytics/:propertyId
 * Returns 12-month projected dynamic revenue for Landlord Dashboard
 */
app.get('/v1/pricing/yield-analytics/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Sample monthly curve reflecting African seasonal surges
    const monthlyProjection = [
      { month: 'Jan', surgeMultiplier: 1.5, event: 'Detty December Outflow' },
      { month: 'Feb', surgeMultiplier: 1.0, event: 'Baseline' },
      { month: 'Mar', surgeMultiplier: 1.0, event: 'Baseline' },
      { month: 'Apr', surgeMultiplier: 1.15, event: 'Easter / Homecoming' },
      { month: 'May', surgeMultiplier: 1.0, event: 'Baseline' },
      { month: 'Jun', surgeMultiplier: 1.05, event: 'Mid-year Expat Transition' },
      { month: 'Jul', surgeMultiplier: 1.25, event: 'Summer Diaspora Peak' },
      { month: 'Aug', surgeMultiplier: 1.30, event: 'Chale Wote / Safari' },
      { month: 'Sep', surgeMultiplier: 1.10, event: 'Baseline' },
      { month: 'Oct', surgeMultiplier: 1.20, event: 'Lagos Tech Week' },
      { month: 'Nov', surgeMultiplier: 1.25, event: 'Pre-December Warmup' },
      { month: 'Dec', surgeMultiplier: 1.85, event: 'December in Ghana / Afro Nation' },
    ];

    res.status(200).json({
      propertyId,
      annualUptimeRate: '99.8%',
      escrowHoldRate: '10% (Reduced from 15% for Zero Strikes)',
      monthlyProjection
    });
  } catch (err) {
    console.error('Error fetching yield analytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Flex-Living AI Dynamic Pricing & Diaspora Surge Engine running on port ${PORT}`);
});
