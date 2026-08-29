const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

const HYBRID_PORT = 3003;

function request(port, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
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

async function runPhase3QA() {
  console.log('====================================================');
  console.log('🛡️  QA AGENT CERTIFICATION SUITE: PHASE 3');
  console.log('    (Hybrid Non-IoT SLA, WhatsApp Engine & Flex-Advance)');
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
    // 0. Setup test property and booking escrow
    const propRes = await pool.query(
      `INSERT INTO listings (id, title, price_per_night, geo_location)
       VALUES (gen_random_uuid(), 'Cantonments Executive Loft', 200.0, ST_GeographyFromText('POINT(-0.1870 5.6037)'))
       RETURNING id`
    );
    const testPropertyId = propRes.rows[0].id;
    const testTenantId = '11111111-1111-1111-1111-111111111111';
    const testHostId = '22222222-2222-2222-2222-222222222222';
    const testBookingId = '33333333-3333-3333-3333-333333333333';

    // Seed 15% Host Escrow ($1,200 total, $180 held in reserve)
    await pool.query(
      `INSERT INTO host_escrows (host_id, booking_id, property_id, total_booking_usd, escrow_reserve_15pct, release_scheduled_at)
       VALUES ($1, $2, $3, 1200.00, 180.00, NOW() + INTERVAL '5 days')`,
      [testHostId, testBookingId, testPropertyId]
    );

    console.log(`[QA Setup] Property: ${testPropertyId}, Escrow: $180.00 reserve\n`);

    // TEST 1: Tenant Outage Report with Geofence & 2-Hour SLA Timer
    console.log('--- Sub-suite A: Tenant Outage & Geofenced SLA Timer ---');
    const claimRes = await request(HYBRID_PORT, 'POST', '/v1/sla/tenant/report-outage', {
      propertyId: testPropertyId,
      tenantId: testTenantId,
      outageType: 'POWER',
      claimLat: 5.6039, // ~25m away from property
      claimLng: -0.1871
    });

    assert(claimRes.status === 201 && claimRes.data.claim.id, 'Tenant outage report successfully filed');
    assert(claimRes.data.geofenceVerified === true, 'Geofence verification passed (< 500m radius)');
    assert(claimRes.data.slaCountdownSeconds === 7200, '2-Hour live SLA countdown timer activated (7,200s)');
    assert(claimRes.data.caretakerNotification.channel === 'WHATSAPP', 'Automated Caretaker WhatsApp urgent alert generated');
    const claimId = claimRes.data.claim.id;

    // TEST 2: Caretaker Daily Morning WhatsApp Pulse Check
    console.log('\n--- Sub-suite B: WhatsApp Caretaker Daily Pulse Checks ---');
    const pulseRes = await request(HYBRID_PORT, 'POST', '/v1/sla/landlord/pulse-check', {
      propertyId: testPropertyId,
      caretakerPhone: '+233551234999',
      gridPowerStatus: 'NORMAL',
      generatorFuelStatus: 'NEEDS_DIESEL',
      waterTankStatus: 'NORMAL'
    });

    assert(pulseRes.status === 201 && pulseRes.data.pulseCheck.id, 'Caretaker WhatsApp pulse check logged in time-series');
    assert(
      pulseRes.data.preventativeAction === 'AUTO_DISPATCH_DIESEL_REFILL_ALERT',
      'Preventative trigger detected low fuel and auto-dispatched diesel refill alert'
    );

    // TEST 3: Claim Resolution & Automated 15% Escrow Deduction
    console.log('\n--- Sub-suite C: Escrow Guarantee & Automated Refund Settlement ---');
    const resolveRes = await request(HYBRID_PORT, 'POST', `/v1/sla/claims/${claimId}/resolve`, {
      status: 'REFUNDED',
      resolutionNotes: 'Outage confirmed. 2-Hour window elapsed without generator start.',
      refundAmountUsd: 35.00
    });

    assert(resolveRes.status === 200 && resolveRes.data.claim.status === 'REFUNDED', 'Claim marked REFUNDED');
    assert(
      resolveRes.data.escrowSettlement &&
      parseFloat(resolveRes.data.escrowSettlement.deducted_refunds_usd) === 35.00 &&
      resolveRes.data.escrowSettlement.status === 'PARTIALLY_REFUNDED',
      'Auto-deducted $35.00 directly from host 15% escrow reserve without chasing landlord'
    );

    // TEST 4: Flex-Advance Rental Financing Underwriting
    console.log('\n--- Sub-suite D: Flex-Advance Fintech Credit Underwriting ---');
    // Prime borrower: $4,000 income, $1,000/mo rent for 6 months ($6,000 advance)
    const advanceApp = await request(HYBRID_PORT, 'POST', '/v1/fintech/flex-advance/apply', {
      userId: testTenantId,
      monthlyIncomeUsd: 4000.00,
      rentalMonthlyPriceUsd: 1000.00,
      requestedMonths: 6,
      flexScore: 740
    });

    assert(advanceApp.status === 201 && advanceApp.data.approvalStatus === 'APPROVED', 'Flex-Advance loan underwriting APPROVED for prime tenant');
    assert(advanceApp.data.underwriting.totalAdvanceUsd === 6000, 'Financed 6 months upfront ($6,000 USD)');
    assert(advanceApp.data.underwriting.monthlyInterestRate === '1.5%', 'Prime monthly interest rate awarded (1.5%)');

    // Overleveraged borrower test: $1,200 income applying for $1,000/mo rent (DTI > 40%)
    const rejectedApp = await request(HYBRID_PORT, 'POST', '/v1/fintech/flex-advance/apply', {
      userId: '44444444-4444-4444-4444-444444444444',
      monthlyIncomeUsd: 1200.00,
      rentalMonthlyPriceUsd: 1000.00,
      requestedMonths: 6,
      flexScore: 620
    });

    assert(rejectedApp.status === 400 && rejectedApp.data.approvalStatus === 'REJECTED', 'Underwriting rule correctly REJECTED over-leveraged applicant (DTI > 40%)');

  } catch (err) {
    console.error('QA Test execution encountered error:', err);
    failed++;
  } finally {
    await pool.end();
  }

  console.log('\n====================================================');
  console.log(`📊 QA CERTIFICATION SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  if (failed === 0) {
    console.log('🏆 STATUS: PHASE 3 QUALITY CERTIFIED AND APPROVED!');
  } else {
    console.log('🚨 STATUS: PHASE 3 REJECTED - ISSUES DETECTED');
  }
  console.log('====================================================\n');
}

runPhase3QA();
