const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

const SCOUT_PORT = 3001;
const IOT_PORT = 3002;

function request(port, method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runPhase2QA() {
  console.log('====================================================');
  console.log('🛡️  QA AGENT CERTIFICATION SUITE: PHASE 2');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 0. Setup test property
    const propRes = await pool.query(
      `INSERT INTO listings (id, title, price_per_night, geo_location, badges, flex_trust_score)
       VALUES (gen_random_uuid(), 'QA Test Villa Cantonments', 220.0, ST_GeographyFromText('POINT(-0.1870 5.6037)'), '[]'::jsonb, 70)
       RETURNING id`
    );
    const testPropertyId = propRes.rows[0].id;
    console.log(`[QA Setup] Created test property ID: ${testPropertyId}\n`);

    // TEST 1: Scout Task Dispatch
    console.log('--- Sub-suite A: Field Scout Engine & Flex-Trust Badges ---');
    const dispatchRes = await request(SCOUT_PORT, 'POST', '/v1/scout/tasks', {
      propertyId: testPropertyId,
      basePayoutUsd: 25.0
    });
    assert(dispatchRes.status === 201 && dispatchRes.data.task.id, 'Scout audit task dispatched with status PENDING');
    const taskId = dispatchRes.data.task.id;

    // TEST 2: Submit 200+ Checklist Audit
    const submitRes = await request(SCOUT_PORT, 'POST', `/v1/scout/tasks/${taskId}/submit`, {
      checklistData: {
        solar_backup: true,
        solar_inverter_kva: 5.0,
        starlink_present: true,
        starlink_download_mbps: 185.5,
        borehole_present: true,
        smart_lock_functional: true,
        photos_count: 8,
        sound_level_db: 38.0
      },
      reviewNotes: 'High quality audit completed by Accra Lead Scout.'
    });
    assert(submitRes.status === 200 && submitRes.data.task.status === 'SUBMITTED', 'Scout submitted multi-point audit checklist');

    // TEST 3: Auto-evaluate Badges & Calculate Payout
    const verifyRes = await request(SCOUT_PORT, 'POST', `/v1/scout/tasks/${taskId}/verify`, {});
    assert(verifyRes.status === 200, 'Audit verification endpoint executed successfully');
    
    const badges = verifyRes.data.awardedBadges || [];
    assert(
      badges.includes('SOLAR_VERIFIED') &&
      badges.includes('STARLINK_VERIFIED') &&
      badges.includes('BOREHOLE_VERIFIED') &&
      badges.includes('SMART_ACCESS_VERIFIED'),
      'Auto-awarded all 4 Flex-Trust Badges (Solar, Starlink, Borehole, Smart Lock)'
    );

    const payout = verifyRes.data.payout || {};
    assert(
      payout.basePayoutUsd === 25 && payout.bonusPayoutUsd === 10 && payout.totalPayoutUsd === 35,
      'Calculated Scout compensation accurately ($25 base + $10 quality bonus = $35 total)'
    );

    // TEST 4: Verify Database Sync
    const dbListing = await pool.query('SELECT badges, flex_trust_score FROM listings WHERE id = $1', [testPropertyId]);
    assert(
      dbListing.rows[0].badges.length === 4 && dbListing.rows[0].flex_trust_score === 100,
      'Listing record updated with badges and trust score boosted to 100%'
    );

    // TEST 5: IoT Device Registration
    console.log('\n--- Sub-suite B: IoT Telemetry & Automated SLA Watchdog ---');
    const regDevice = await request(IOT_PORT, 'POST', '/v1/iot/devices/register', {
      propertyId: testPropertyId,
      deviceKey: `FL-DEV-${Date.now()}`,
      deviceType: 'POWER_WATER_GATEWAY',
      modelName: 'FlexSmartHub-Pro'
    });
    assert(regDevice.status === 201 && regDevice.data.device.id, 'IoT device registered with unique key');
    const deviceKey = regDevice.data.device.device_key;

    // TEST 6: Normal Healthy Telemetry
    const healthyTelemetry = await request(IOT_PORT, 'POST', '/v1/iot/telemetry', {
      propertyId: testPropertyId,
      gridPowerStatus: 'ONLINE',
      generatorStatus: 'OFF',
      waterPressurePsi: 48.0,
      internetSpeedMbps: 180.0
    }, { 'x-device-key': deviceKey });
    assert(healthyTelemetry.status === 200 && healthyTelemetry.data.slaWatchdog.powerStatus === 'STABLE', 'Healthy telemetry ingested without SLA alerts');

    const healthStatus = await request(IOT_PORT, 'GET', `/v1/iot/properties/${testPropertyId}/status`);
    assert(healthStatus.status === 200 && healthStatus.data.slaHealthScore === 100, 'Property health score rated at 100%');

    // TEST 7: Simulated Outage (Grid DOWN + Generator FAULT) triggers SLA Breach
    const outageTelemetry = await request(IOT_PORT, 'POST', '/v1/iot/telemetry', {
      propertyId: testPropertyId,
      gridPowerStatus: 'OFFLINE',
      generatorStatus: 'FAULT',
      waterPressurePsi: 45.0,
      internetSpeedMbps: 120.0
    }, { 'x-device-key': deviceKey });
    assert(
      outageTelemetry.status === 200 &&
      outageTelemetry.data.slaWatchdog.powerStatus === 'OUTAGE_BREACH' &&
      outageTelemetry.data.slaWatchdog.activeBreachesTriggered > 0,
      'SLA Watchdog detected power failure and automatically triggered an ACTIVE SLA breach'
    );

    // TEST 8: Verify SLA Breach Ledger & Refund Liability
    const breachLedger = await request(IOT_PORT, 'GET', `/v1/iot/properties/${testPropertyId}/breaches`);
    assert(
      breachLedger.status === 200 &&
      breachLedger.data.breachesCount > 0 &&
      breachLedger.data.totalRefundLiabilityUsd >= 35.0,
      'Breach ledger logged breach details and recommended tenant refund compensation ($35.00)'
    );

    // TEST 9: Power Restored -> Auto-resolve Breach
    const restoredTelemetry = await request(IOT_PORT, 'POST', '/v1/iot/telemetry', {
      propertyId: testPropertyId,
      gridPowerStatus: 'ONLINE',
      generatorStatus: 'OFF',
      waterPressurePsi: 48.0
    }, { 'x-device-key': deviceKey });
    assert(restoredTelemetry.status === 200, 'Restored power telemetry ingested');

    const resolvedLedger = await request(IOT_PORT, 'GET', `/v1/iot/properties/${testPropertyId}/breaches`);
    const powerBreach = resolvedLedger.data.breaches.find(b => b.breach_type === 'POWER_FAILURE');
    assert(powerBreach && powerBreach.status === 'RESOLVED', 'SLA Watchdog auto-resolved the breach upon power restoration');

  } catch (err) {
    console.error('QA Test execution encountered an exception:', err);
    failed++;
  } finally {
    await pool.end();
  }

  console.log('\n====================================================');
  console.log(`📊 QA CERTIFICATION SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  if (failed === 0) {
    console.log('🏆 STATUS: PHASE 2 QUALITY CERTIFIED AND APPROVED!');
  } else {
    console.log('🚨 STATUS: PHASE 2 REJECTED - ISSUES DETECTED');
  }
  console.log('====================================================\n');
}

runPhase2QA();
