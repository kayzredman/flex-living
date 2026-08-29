require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'hybrid-sla-and-fintech-engine' });
});

/**
 * Helper: Haversine distance in meters
 */
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * POST /v1/sla/tenant/report-outage
 * One-tap tenant outage report with Geofencing & 2-Hour SLA Countdown Timer
 */
app.post('/v1/sla/tenant/report-outage', async (req, res) => {
  try {
    const { propertyId, tenantId, outageType = 'POWER', claimLat, claimLng } = req.body;

    if (!propertyId || !tenantId) {
      return res.status(400).json({ error: 'propertyId and tenantId are required' });
    }

    // 1. Geofence Verification against Property PostGIS location
    let geofenceVerified = true;
    const propQuery = await pool.query(
      'SELECT ST_X(geo_location::geometry) as lng, ST_Y(geo_location::geometry) as lat, title FROM listings WHERE id = $1',
      [propertyId]
    );

    if (propQuery.rows.length > 0 && claimLat && claimLng) {
      const propLat = propQuery.rows[0].lat;
      const propLng = propQuery.rows[0].lng;
      const distance = getDistanceMeters(claimLat, claimLng, propLat, propLng);
      // Valid if within 500m radius of property
      geofenceVerified = distance <= 500;
    }

    // 2. Set 2-hour SLA resolution countdown timer
    const slaTimerExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO tenant_outage_claims (
        property_id, tenant_id, outage_type, claim_lat, claim_lng,
        geofence_verified, status, sla_window_minutes, sla_timer_expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'INVESTIGATING', 120, $7)
      RETURNING *`,
      [propertyId, tenantId, outageType, claimLat || null, claimLng || null, geofenceVerified, slaTimerExpiresAt]
    );

    const claim = result.rows[0];

    // 3. Simulated Caretaker WhatsApp Instant Alert
    const caretakerAlert = {
      channel: 'WHATSAPP',
      recipient: 'Caretaker / Landlord',
      message: `🚨 URGENT: Tenant reported ${outageType} outage at ${propQuery.rows[0]?.title || 'Property'}. 2-Hour SLA Resolution Timer is active. Expiration: ${slaTimerExpiresAt.toISOString()}`
    };

    res.status(201).json({
      message: 'Outage claim filed. SLA countdown timer activated.',
      claim,
      geofenceVerified,
      slaCountdownSeconds: 7200,
      caretakerNotification: caretakerAlert
    });
  } catch (err) {
    console.error('Error reporting tenant outage:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/sla/landlord/pulse-check
 * Daily Morning WhatsApp Bot Caretaker Check
 */
app.post('/v1/sla/landlord/pulse-check', async (req, res) => {
  try {
    const {
      propertyId,
      caretakerPhone,
      gridPowerStatus = 'NORMAL',
      generatorFuelStatus = 'FULL',
      waterTankStatus = 'NORMAL',
      reportedVia = 'WHATSAPP'
    } = req.body;

    if (!propertyId || !caretakerPhone) {
      return res.status(400).json({ error: 'propertyId and caretakerPhone are required' });
    }

    const result = await pool.query(
      `INSERT INTO caretaker_pulse_checks (
        property_id, caretaker_phone, grid_power_status, generator_fuel_status, water_tank_status, reported_via
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [propertyId, caretakerPhone, gridPowerStatus, generatorFuelStatus, waterTankStatus, reportedVia]
    );

    let preventativeAction = 'ALL_CLEAR';
    if (generatorFuelStatus === 'NEEDS_DIESEL' || generatorFuelStatus === 'CRITICAL') {
      preventativeAction = 'AUTO_DISPATCH_DIESEL_REFILL_ALERT';
    }

    res.status(201).json({
      message: 'Caretaker pulse check logged successfully',
      pulseCheck: result.rows[0],
      preventativeAction,
      nextScheduledCheck: 'Tomorrow 08:00 AM'
    });
  } catch (err) {
    console.error('Error logging pulse check:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/sla/claims/:id/resolve
 * Resolve Claim & Auto-deduct from 15% Host Escrow if breach occurred
 */
app.post('/v1/sla/claims/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'RESOLVED', resolutionNotes, refundAmountUsd = 0.0 } = req.body;

    const claimQuery = await pool.query('SELECT * FROM tenant_outage_claims WHERE id = $1', [id]);
    if (claimQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const claim = claimQuery.rows[0];

    const updatedClaim = await pool.query(
      `UPDATE tenant_outage_claims
       SET status = $1, resolution_notes = $2, refund_amount_usd = $3, resolved_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [status, resolutionNotes || null, refundAmountUsd, id]
    );

    let escrowDeduction = null;
    if (status === 'REFUNDED' && refundAmountUsd > 0) {
      // Look up active escrow for this property
      const escrowQuery = await pool.query(
        "SELECT * FROM host_escrows WHERE property_id = $1 AND status = 'HELD' ORDER BY created_at DESC LIMIT 1",
        [claim.property_id]
      );

      if (escrowQuery.rows.length > 0) {
        const escrow = escrowQuery.rows[0];
        const newDeduction = parseFloat(escrow.deducted_refunds_usd) + parseFloat(refundAmountUsd);
        const escrowUpdate = await pool.query(
          `UPDATE host_escrows
           SET deducted_refunds_usd = $1, status = 'PARTIALLY_REFUNDED'
           WHERE id = $2
           RETURNING *`,
          [newDeduction, escrow.id]
        );
        escrowDeduction = escrowUpdate.rows[0];
      }
    }

    res.status(200).json({
      message: `Claim ${status}`,
      claim: updatedClaim.rows[0],
      escrowSettlement: escrowDeduction
    });
  } catch (err) {
    console.error('Error resolving claim:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/fintech/flex-advance/apply
 * Monthly Rental Advance Credit Underwriting & Loan Issuance
 */
app.post('/v1/fintech/flex-advance/apply', async (req, res) => {
  try {
    const { userId, monthlyIncomeUsd, rentalMonthlyPriceUsd, requestedMonths = 6, flexScore = 720 } = req.body;

    if (!userId || !monthlyIncomeUsd || !rentalMonthlyPriceUsd) {
      return res.status(400).json({ error: 'userId, monthlyIncomeUsd, and rentalMonthlyPriceUsd are required' });
    }

    const totalAdvance = rentalMonthlyPriceUsd * requestedMonths;
    // Prime rate (1.5%/mo) if flexScore >= 700, otherwise 2.5%
    const monthlyRate = flexScore >= 700 ? 0.015 : 0.025;
    const totalFinancingCost = totalAdvance * (monthlyRate * requestedMonths);
    const totalRepayment = totalAdvance + totalFinancingCost;
    const monthlyRepayment = totalRepayment / requestedMonths;

    // Underwriting Rule: Monthly repayment cannot exceed 40% of monthly income
    const dtiRatio = (monthlyRepayment / monthlyIncomeUsd) * 100;
    if (dtiRatio > 40) {
      return res.status(400).json({
        approvalStatus: 'REJECTED',
        reason: `Debt-to-Income ratio (${dtiRatio.toFixed(1)}%) exceeds 40% threshold. Lower requested tenure or rental amount.`
      });
    }

    const result = await pool.query(
      `INSERT INTO flex_advances (
        user_id, advance_amount_usd, monthly_repayment_usd, tenure_months, credit_score, approval_status
      ) VALUES ($1, $2, $3, $4, $5, 'APPROVED')
      RETURNING *`,
      [userId, totalAdvance, monthlyRepayment.toFixed(2), requestedMonths, flexScore]
    );

    res.status(201).json({
      approvalStatus: 'APPROVED',
      advance: result.rows[0],
      underwriting: {
        totalAdvanceUsd: totalAdvance,
        monthlyRepaymentUsd: parseFloat(monthlyRepayment.toFixed(2)),
        tenureMonths: requestedMonths,
        monthlyInterestRate: `${(monthlyRate * 100).toFixed(1)}%`,
        dtiRatio: `${dtiRatio.toFixed(1)}%`
      }
    });
  } catch (err) {
    console.error('Error applying for Flex-Advance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Flex-Living Hybrid SLA & Fintech Engine running on port ${PORT}`);
});
