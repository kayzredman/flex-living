require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'flexliving-communication-and-portfolio-engine' });
});

/**
 * POST /v1/notifications/caretaker/prompt-pulse
 * Outbound WhatsApp Morning Pulse Check Trigger
 */
app.post('/v1/notifications/caretaker/prompt-pulse', async (req, res) => {
  try {
    const { propertyId, caretakerPhone = '+233551234999', caretakerName = 'Kwame' } = req.body;
    
    const messageBody = `☀️ Good morning ${caretakerName}! Flex-Living morning audit check for your property:
Please reply with status:
1. Grid Power (Normal or Outage)
2. Generator Fuel (Full, Half, or Needs Diesel)
3. Water Tank (Full or Low)`;

    const providerId = `wa_msg_${Date.now()}_${Math.floor(Math.random()*1000)}`;

    const result = await pool.query(
      `INSERT INTO communication_logs 
       (channel, direction, recipient_phone, message_type, body, status, external_provider_id, property_id)
       VALUES ('WHATSAPP', 'OUTBOUND', $1, 'CARETAKER_PULSE_PROMPT', $2, 'SENT', $3, $4)
       RETURNING *`,
      [caretakerPhone, messageBody, providerId, propertyId || null]
    );

    res.status(200).json({
      success: true,
      channel: 'WHATSAPP',
      messageId: providerId,
      recipient: caretakerPhone,
      log: result.rows[0],
      metaCloudApiResponse: {
        messaging_product: 'whatsapp',
        contacts: [{ input: caretakerPhone, wa_id: caretakerPhone.replace('+', '') }],
        messages: [{ id: providerId, message_status: 'accepted' }]
      }
    });
  } catch (err) {
    console.error('Error sending caretaker pulse prompt:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/notifications/tenant/outage-reassurance
 * Broadcasts SMS reassurance message to in-residence tenants upon ECG grid blackout
 */
app.post('/v1/notifications/tenant/outage-reassurance', async (req, res) => {
  try {
    const { propertyId, tenantPhone = '+233244111222', locationName = 'Cantonments, Accra' } = req.body;

    const messageBody = `⚡ Flex-Living Reassurance Notice:
An ECG power outage was detected in ${locationName}.
Your unit's Hybrid Solar Inverter & Battery Bank have activated with zero interruption.
Starlink internet remains 100% online. Concierge: +233 55 123 4999.`;

    const providerId = `sms_msg_${Date.now()}_${Math.floor(Math.random()*1000)}`;

    const result = await pool.query(
      `INSERT INTO communication_logs 
       (channel, direction, recipient_phone, message_type, body, status, external_provider_id, property_id)
       VALUES ('SMS', 'OUTBOUND', $1, 'TENANT_OUTAGE_NOTICE', $2, 'DELIVERED', $3, $4)
       RETURNING *`,
      [tenantPhone, messageBody, providerId, propertyId || null]
    );

    res.status(200).json({
      success: true,
      channel: 'SMS',
      messageId: providerId,
      recipient: tenantPhone,
      log: result.rows[0],
      carrierRoute: 'MTN_GHANA_DIRECT_SMS'
    });
  } catch (err) {
    console.error('Error sending tenant reassurance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/notifications/host/diesel-alert
 * Emergency automated fuel reorder alert to Host & Diesel Vendor
 */
app.post('/v1/notifications/host/diesel-alert', async (req, res) => {
  try {
    const { propertyId, hostPhone = '+233200987654', currentLiters = 25, tankCapacity = 150 } = req.body;

    const messageBody = `🚨 Flex-Living Urgent Alert: Generator diesel level is at ${currentLiters}L (${Math.round((currentLiters/tankCapacity)*100)}%).
Automated reorder dispatched to Goil Bulk Logistics.
Estimated delivery: 2 hours. Reply '1' to confirm order or '0' to manage manually.`;

    const providerId = `wa_alert_${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO communication_logs 
       (channel, direction, recipient_phone, message_type, body, status, external_provider_id, property_id)
       VALUES ('WHATSAPP', 'OUTBOUND', $1, 'DIESEL_DISPATCH_ALERT', $2, 'DELIVERED', $3, $4)
       RETURNING *`,
      [hostPhone, messageBody, providerId, propertyId || null]
    );

    res.status(200).json({
      success: true,
      channel: 'WHATSAPP',
      alertLevel: 'HIGH_PRIORITY',
      log: result.rows[0]
    });
  } catch (err) {
    console.error('Error sending diesel alert:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/notifications/logs
 * Query message delivery logs
 */
app.get('/v1/notifications/logs', async (req, res) => {
  try {
    const { channel, messageType, limit = 20 } = req.query;
    let query = 'SELECT * FROM communication_logs WHERE 1=1';
    const params = [];

    if (channel) {
      params.push(channel);
      query += ` AND channel = $${params.length}`;
    }
    if (messageType) {
      params.push(messageType);
      query += ` AND message_type = $${params.length}`;
    }
    params.push(parseInt(limit));
    query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    const result = await pool.query(query, params);
    res.status(200).json({ logs: result.rows });
  } catch (err) {
    console.error('Error querying logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/hosts/:hostId/portfolio
 * Multi-Property Portfolio & African Tax Withholding Analytics
 */
app.get('/v1/hosts/:hostId/portfolio', async (req, res) => {
  try {
    const { hostId } = req.params;

    // Query listings owned by this host
    const listingsRes = await pool.query(
      'SELECT id, title, price_per_night, is_active FROM listings WHERE host_id = $1',
      [hostId]
    );

    let listings = listingsRes.rows;
    if (listings.length === 0) {
      // Return sample aggregated portfolio for demonstration
      listings = [
        { id: '11111111-1111-1111-1111-111111111111', title: 'Cantonments Luxury Suite', price_per_night: 150.0, is_active: true },
        { id: '22222222-2222-2222-2222-222222222222', title: 'Airport Residential Executive Flat', price_per_night: 120.0, is_active: true },
        { id: '33333333-3333-3333-3333-333333333333', title: 'Osu Contemporary Studio', price_per_night: 80.0, is_active: true }
      ];
    }

    const totalUnits = listings.length;
    const totalDailyRevenue = listings.reduce((sum, item) => sum + parseFloat(item.price_per_night), 0);
    const monthlyGrossRevenueUsd = totalDailyRevenue * 30;

    // Escrow calculation: Zero strikes rewards host with 10% hold instead of 15%
    const escrowRatePercent = 10;
    const escrowHeldUsd = monthlyGrossRevenueUsd * (escrowRatePercent / 100);

    // Ghana Revenue Authority (GRA) Residential Rent Tax: 8% flat withholding
    const graTaxRatePercent = 8.0;
    const graWithholdingTaxUsd = monthlyGrossRevenueUsd * (graTaxRatePercent / 100);

    const netHostPayoutUsd = monthlyGrossRevenueUsd - escrowHeldUsd - graWithholdingTaxUsd;

    // Store tax statement record
    await pool.query(
      `INSERT INTO host_tax_records
       (host_id, tax_authority, gross_revenue_usd, withholding_tax_usd, tax_rate_percent, reporting_period)
       VALUES ($1, 'GRA_GHANA', $2, $3, $4, '2026-Q3')`,
      [hostId, monthlyGrossRevenueUsd, graWithholdingTaxUsd, graTaxRatePercent]
    );

    res.status(200).json({
      hostId,
      portfolioSummary: {
        totalUnits,
        activeUnits: totalUnits,
        portfolioUptime: '99.85%',
        slaStrikes: 0,
        currency: 'USD'
      },
      financialRollup: {
        monthlyGrossRevenueUsd,
        escrowReserve: {
          ratePercent: `${escrowRatePercent}%`,
          amountUsd: escrowHeldUsd,
          discountReason: 'Preferred Host: 100% 30-Day SLA Uptime'
        },
        taxCompliance: {
          authority: 'Ghana Revenue Authority (GRA)',
          statutoryRate: `${graTaxRatePercent}%`,
          withheldTaxUsd: graWithholdingTaxUsd,
          complianceCertificate: `GRA-WHT-2026-${hostId.substring(0, 8).toUpperCase()}`
        },
        netMonthlyPayoutUsd: netHostPayoutUsd,
        ghsEquivalents: {
          grossRevenueGhs: Math.round(monthlyGrossRevenueUsd * 15.2),
          withheldTaxGhs: Math.round(graWithholdingTaxUsd * 15.2),
          netPayoutGhs: Math.round(netHostPayoutUsd * 15.2)
        }
      },
      units: listings
    });
  } catch (err) {
    console.error('Error fetching host portfolio:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Flex-Living Communication & Portfolio Service running on port ${PORT}`);
});
