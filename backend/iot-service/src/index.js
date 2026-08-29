require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'iot-telemetry-engine' });
});

/**
 * POST /v1/iot/devices/register
 * Register a new IoT device (smart meter, gateway, smart lock)
 */
app.post('/v1/iot/devices/register', async (req, res) => {
  try {
    const { propertyId, deviceKey, deviceType, modelName } = req.body;
    if (!propertyId || !deviceKey || !deviceType) {
      return res.status(400).json({ error: 'propertyId, deviceKey, and deviceType are required' });
    }

    const result = await pool.query(
      `INSERT INTO iot_devices (property_id, device_key, device_type, model_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (device_key) DO UPDATE SET last_heartbeat = NOW()
       RETURNING *`,
      [propertyId, deviceKey, deviceType, modelName || 'FlexSensor-v1']
    );

    res.status(201).json({
      message: 'IoT Device registered successfully',
      device: result.rows[0]
    });
  } catch (err) {
    console.error('Error registering device:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/iot/telemetry
 * Ingest high-frequency telemetry from sensors & run SLA watchdog
 */
app.post('/v1/iot/telemetry', async (req, res) => {
  try {
    const deviceKey = req.headers['x-device-key'];
    const {
      propertyId,
      gridPowerStatus = 'ONLINE',
      generatorStatus = 'OFF',
      waterPressurePsi = 45.0,
      internetSpeedMbps = 120.0,
      internetLatencyMs = 28.0,
      lockState = 'LOCKED',
      batteryLevel = 95
    } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'propertyId is required' });
    }

    // 1. Verify device if key provided
    let deviceId = null;
    if (deviceKey) {
      const devQuery = await pool.query(
        'SELECT id FROM iot_devices WHERE device_key = $1 AND property_id = $2',
        [deviceKey, propertyId]
      );
      if (devQuery.rows.length > 0) {
        deviceId = devQuery.rows[0].id;
        await pool.query('UPDATE iot_devices SET last_heartbeat = NOW() WHERE id = $1', [deviceId]);
      }
    }

    // 2. Insert telemetry event
    const telemetryResult = await pool.query(
      `INSERT INTO iot_telemetry (
        property_id, device_id, grid_power_status, generator_status,
        water_pressure_psi, internet_speed_mbps, internet_latency_ms, lock_state, battery_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        propertyId, deviceId, gridPowerStatus, generatorStatus,
        waterPressurePsi, internetSpeedMbps, internetLatencyMs, lockState, batteryLevel
      ]
    );

    // 3. Automated SLA Watchdog Evaluation
    const detectedBreaches = [];

    // Condition A: Power failure (Grid OFFLINE and Generator is NOT RUNNING)
    const isPowerDown = (gridPowerStatus === 'OFFLINE' && generatorStatus !== 'RUNNING');
    
    // Check if there is an active power breach
    const activePowerBreachQuery = await pool.query(
      "SELECT * FROM sla_breaches WHERE property_id = $1 AND breach_type = 'POWER_FAILURE' AND status = 'ACTIVE'",
      [propertyId]
    );

    if (isPowerDown) {
      if (activePowerBreachQuery.rows.length === 0) {
        // Trigger New Breach
        const newBreach = await pool.query(
          `INSERT INTO sla_breaches (property_id, breach_type, severity, description, refund_recommended_usd, status)
           VALUES ($1, 'POWER_FAILURE', 'CRITICAL', 'Grid power offline and backup generator failed to engage', 35.00, 'ACTIVE')
           RETURNING *`,
          [propertyId]
        );
        detectedBreaches.push(newBreach.rows[0]);
      }
    } else {
      // If power restored, auto-resolve any active power breach
      if (activePowerBreachQuery.rows.length > 0) {
        await pool.query(
          `UPDATE sla_breaches
           SET status = 'RESOLVED', outage_resolved_at = NOW(),
               duration_minutes = GREATEST(1, EXTRACT(EPOCH FROM (NOW() - outage_started_at))/60)::int
           WHERE id = $1`,
          [activePowerBreachQuery.rows[0].id]
        );
      }
    }

    // Condition B: Critical Internet Degradation (< 5 Mbps or > 300ms)
    if (internetSpeedMbps < 5.0 || internetLatencyMs > 300) {
      const activeNet = await pool.query(
        "SELECT id FROM sla_breaches WHERE property_id = $1 AND breach_type = 'INTERNET_OUTAGE' AND status = 'ACTIVE'",
        [propertyId]
      );
      if (activeNet.rows.length === 0) {
        const netBreach = await pool.query(
          `INSERT INTO sla_breaches (property_id, breach_type, severity, description, refund_recommended_usd, status)
           VALUES ($1, 'INTERNET_OUTAGE', 'HIGH', 'Starlink internet speed fell below 5Mbps threshold', 15.00, 'ACTIVE')
           RETURNING *`,
          [propertyId]
        );
        detectedBreaches.push(netBreach.rows[0]);
      }
    }

    res.status(200).json({
      message: 'Telemetry ingested successfully',
      telemetry: telemetryResult.rows[0],
      slaWatchdog: {
        powerStatus: isPowerDown ? 'OUTAGE_BREACH' : 'STABLE',
        activeBreachesTriggered: detectedBreaches.length,
        newBreaches: detectedBreaches
      }
    });
  } catch (err) {
    console.error('Error ingesting telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/iot/properties/:id/status
 * Real-time property health dashboard
 */
app.get('/v1/iot/properties/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    // Latest telemetry
    const telQuery = await pool.query(
      'SELECT * FROM iot_telemetry WHERE property_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [id]
    );

    // Active breaches
    const breachQuery = await pool.query(
      "SELECT * FROM sla_breaches WHERE property_id = $1 AND status = 'ACTIVE'",
      [id]
    );

    const latest = telQuery.rows[0] || null;
    const activeBreaches = breachQuery.rows;

    let slaHealthScore = 100;
    if (activeBreaches.some(b => b.severity === 'CRITICAL')) slaHealthScore -= 40;
    if (activeBreaches.some(b => b.severity === 'HIGH')) slaHealthScore -= 20;

    res.status(200).json({
      propertyId: id,
      slaHealthScore: Math.max(0, slaHealthScore),
      currentTelemetry: latest,
      activeBreachesCount: activeBreaches.length,
      activeBreaches
    });
  } catch (err) {
    console.error('Error fetching property status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/iot/properties/:id/breaches
 * Historical and active SLA breaches ledger
 */
app.get('/v1/iot/properties/:id/breaches', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM sla_breaches WHERE property_id = $1 ORDER BY outage_started_at DESC',
      [id]
    );

    const totalRefundLiability = result.rows
      .filter(r => r.status === 'ACTIVE' || r.status === 'RESOLVED')
      .reduce((sum, r) => sum + parseFloat(r.refund_recommended_usd || 0), 0);

    res.status(200).json({
      propertyId: id,
      breachesCount: result.rows.length,
      totalRefundLiabilityUsd: totalRefundLiability,
      breaches: result.rows
    });
  } catch (err) {
    console.error('Error querying breaches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Flex-Living IoT Telemetry & SLA Watchdog running on port ${PORT}`);
});
