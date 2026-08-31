/**
 * QA Phase 4 Automated Test Suite
 * Flex-Living API Gateway, WhatsApp Inbound Webhook & End-to-End Routing
 */

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://127.0.0.1:3004';

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('🛡️  QA AGENT: RUNNING PHASE 4 TEST SUITE');
  console.log(`🌐  Target Gateway: ${GATEWAY_URL}`);
  console.log('====================================================\n');

  try {
    // Test 1: Gateway Health Check
    console.log('Test 1: API Gateway Health & Service Registry');
    const healthRes = await fetch(`${GATEWAY_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Gateway responds with 200 OK');
    assert(healthData.status === 'HEALTHY', 'Gateway status is HEALTHY');
    assert(healthData.routes.listings.includes('/v1/listings'), 'Catalog route is registered');

    // Test 2: Gateway Proxy to FastAPI Listing Catalog (PostGIS Spatial Query)
    console.log('\nTest 2: Proxy to FastAPI PostGIS Catalog');
    const listingRes = await fetch(`${GATEWAY_URL}/v1/listings?lat=5.58&lng=-0.17&radius_km=10`);
    const listings = await listingRes.json();
    assert(listingRes.status === 200, 'Gateway proxied spatial query successfully');
    assert(Array.isArray(listings), 'Listings result is an array');
    assert(listings.length > 0, `Returned ${listings.length} listings in Accra`);
    const targetListing = listings[0];
    const testPropertyId = targetListing.id;

    // Test 3: Caretaker WhatsApp Inbound Webhook - Normal Pulse Check
    console.log('\nTest 3: Caretaker WhatsApp Webhook - Normal Status Ingestion');
    const waPayload1 = {
      From: '+233551234999',
      Body: 'ECG Grid Normal, Solar Inverter 100%, Diesel Full, Water Tank full',
      PropertyId: testPropertyId
    };
    const waRes1 = await fetch(`${GATEWAY_URL}/v1/sla/whatsapp/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waPayload1)
    });
    const waData1 = await waRes1.json();
    assert(waRes1.status === 200, 'WhatsApp webhook accepted with 200 OK');
    assert(waData1.parsed.gridPowerStatus === 'NORMAL', 'Parsed gridPowerStatus = NORMAL');
    assert(waData1.parsed.generatorFuelStatus === 'FULL', 'Parsed generatorFuelStatus = FULL');
    assert(waData1.replyMessage.includes('Pulse Confirmed'), 'Automated confirmation message generated');

    // Test 4: Caretaker WhatsApp Inbound Webhook - Diesel Alert Parsing
    console.log('\nTest 4: Caretaker WhatsApp Webhook - Diesel Alert Natural Language Parsing');
    const waPayload2 = {
      From: '+233551234999',
      Body: 'Blackout in Cantonments, generator running, diesel level is low refill needed',
      PropertyId: testPropertyId
    };
    const waRes2 = await fetch(`${GATEWAY_URL}/v1/sla/whatsapp/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waPayload2)
    });
    const waData2 = await waRes2.json();
    assert(waRes2.status === 200, 'WhatsApp webhook accepted alert');
    assert(waData2.parsed.gridPowerStatus === 'GRID_OFF', 'Parsed gridPowerStatus = GRID_OFF');
    assert(waData2.parsed.generatorFuelStatus === 'NEEDS_DIESEL', 'Parsed generatorFuelStatus = NEEDS_DIESEL');
    assert(waData2.replyMessage.includes('Refill recorded'), 'Preventative diesel dispatch notification generated');

    // Test 5: Geofenced Outage Claim Submission via Gateway
    console.log('\nTest 5: Geofenced Outage Claim via Gateway');
    const claimPayload = {
      propertyId: testPropertyId,
      tenantId: 'd3b07384-d113-40e9-a352-7e047715f212',
      outageType: 'POWER',
      claimLat: targetListing.lat,
      claimLng: targetListing.lng
    };
    const claimRes = await fetch(`${GATEWAY_URL}/v1/sla/tenant/report-outage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimPayload)
    });
    const claimData = await claimRes.json();
    assert(claimRes.status === 201, 'Claim filed successfully through Gateway');
    assert(claimData.geofenceVerified === true, 'Geofence location (<500m) validated');
    assert(claimData.claim.sla_window_minutes === 120, '2-Hour countdown timer initiated (120 mins)');

    // Test 6: Flex-Advance Underwriting via Gateway
    console.log('\nTest 6: Flex-Advance Fintech Underwriting via Gateway');
    const loanPayload = {
      userId: 'd3b07384-d113-40e9-a352-7e047715f212',
      monthlyIncomeUsd: 1200.00,
      rentalMonthlyPriceUsd: 260.00,
      requestedMonths: 6,
      flexScore: 720
    };
    const loanRes = await fetch(`${GATEWAY_URL}/v1/fintech/flex-advance/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanPayload)
    });
    const loanData = await loanRes.json();
    assert(loanRes.status === 201, 'Underwriting calculation completed via Gateway');
    assert(loanData.approvalStatus === 'APPROVED', 'Prime tenant approved with DTI <= 40%');
    assert(loanData.underwriting.monthlyInterestRate === '1.5%', 'Assigned 1.5% prime interest rate');

    // Test 7: Field Scout Queue Dispatch via Gateway
    console.log('\nTest 7: Field Scout Queue Dispatch via Gateway');
    const scoutRes = await fetch(`${GATEWAY_URL}/v1/scout/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: testPropertyId })
    });
    const scoutData = await scoutRes.json();
    assert(scoutRes.status === 201, 'Scout task dispatched via Gateway');
    assert(scoutData.task.status === 'PENDING', 'Scout task assigned to active field queue');

    console.log('\n====================================================');
    console.log(`🎯  QA SUMMARY: ${testsPassed}/${testsTotal} TESTS PASSED`);
    if (testsPassed === testsTotal) {
      console.log('🏆  PHASE 4 QUALITY CERTIFICATION: APPROVED');
    } else {
      console.error('⚠️  PHASE 4 QUALITY CERTIFICATION: FAILED');
      process.exit(1);
    }
    console.log('====================================================');
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runPhase4Tests();
