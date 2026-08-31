/**
 * QA Phase 6 Automated Test Suite
 * Production SMS & WhatsApp Cloud Engine + Multi-Property Portfolio Analytics
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

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('🛡️  QA AGENT: RUNNING PHASE 6 TEST SUITE');
  console.log('📡  SMS & WhatsApp Cloud Engine + Multi-Property Portfolio');
  console.log(`🌐  Target Gateway: ${GATEWAY_URL}`);
  console.log('====================================================\n');

  try {
    // Test 1: Gateway Routing to Communication Service
    console.log('Test 1: Gateway Service Registry & Routing');
    const healthRes = await fetch(`${GATEWAY_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Gateway responds with 200 OK');
    assert(healthData.routes.notifications.includes('/v1/notifications'), 'Notifications route registered');
    assert(healthData.routes.hosts.includes('/v1/hosts'), 'Hosts portfolio route registered');

    // Test 2: Outbound Caretaker WhatsApp Pulse Check Dispatch
    console.log('\nTest 2: Caretaker WhatsApp Pulse Check Prompt');
    const pulseRes = await fetch(`${GATEWAY_URL}/v1/notifications/caretaker/prompt-pulse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caretakerPhone: '+233551234999',
        caretakerName: 'Kwame Mensah',
        propertyId: 'd840a121-06fc-40e4-be13-8f2823d82036'
      })
    });
    const pulseData = await pulseRes.json();
    assert(pulseRes.status === 200, 'WhatsApp prompt accepted with 200 OK');
    assert(pulseData.channel === 'WHATSAPP', 'Channel confirmed as WHATSAPP');
    assert(pulseData.log.message_type === 'CARETAKER_PULSE_PROMPT', 'Logged as CARETAKER_PULSE_PROMPT');
    assert(pulseData.metaCloudApiResponse.messaging_product === 'whatsapp', 'Formatted for Meta Cloud API');

    // Test 3: In-Residence Tenant Blackout Reassurance SMS
    console.log('\nTest 3: In-Residence Tenant Blackout Reassurance SMS');
    const smsRes = await fetch(`${GATEWAY_URL}/v1/notifications/tenant/outage-reassurance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantPhone: '+233244888999',
        locationName: 'Cantonments Luxury Suite',
        propertyId: 'd840a121-06fc-40e4-be13-8f2823d82036'
      })
    });
    const smsData = await smsRes.json();
    assert(smsRes.status === 200, 'Tenant reassurance SMS dispatched with 200 OK');
    assert(smsData.channel === 'SMS', 'Channel confirmed as SMS');
    assert(smsData.carrierRoute === 'MTN_GHANA_DIRECT_SMS', 'Routed via direct African carrier aggregator');
    assert(smsData.log.body.includes('Hybrid Solar Inverter'), 'Reassurance message includes solar backup notice');

    // Test 4: Emergency Diesel Refill Alert to Host
    console.log('\nTest 4: Host Urgent Diesel Refill WhatsApp Alert');
    const dieselRes = await fetch(`${GATEWAY_URL}/v1/notifications/host/diesel-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostPhone: '+233200987654',
        currentLiters: 18,
        tankCapacity: 150
      })
    });
    const dieselData = await dieselRes.json();
    assert(dieselRes.status === 200, 'Diesel alert accepted with 200 OK');
    assert(dieselData.alertLevel === 'HIGH_PRIORITY', 'Flagged as HIGH_PRIORITY alert');
    assert(dieselData.log.body.includes('Goil Bulk Logistics'), 'Automated logistics vendor included');

    // Test 5: Message Delivery Audit Logs Query
    console.log('\nTest 5: Communication Delivery Audit Logs Query');
    const logsRes = await fetch(`${GATEWAY_URL}/v1/notifications/logs?limit=10`);
    const logsData = await logsRes.json();
    assert(logsRes.status === 200, 'Audit logs retrieved successfully');
    assert(Array.isArray(logsData.logs), 'Logs output is an array');
    assert(logsData.logs.length >= 3, `Retrieved ${logsData.logs.length} logged messages`);

    // Test 6: Multi-Property Host Portfolio & GRA Tax Analytics
    console.log('\nTest 6: Multi-Property Host Portfolio & Ghana GRA Tax Analytics');
    const hostId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
    const portfolioRes = await fetch(`${GATEWAY_URL}/v1/hosts/${hostId}/portfolio`);
    const portfolioData = await portfolioRes.json();
    assert(portfolioRes.status === 200, 'Host portfolio analytics returned 200 OK');
    assert(portfolioData.portfolioSummary.totalUnits > 0, `Aggregated ${portfolioData.portfolioSummary.totalUnits} managed units`);
    assert(portfolioData.portfolioSummary.portfolioUptime === '99.85%', 'High reliability SLA portfolio score');
    assert(portfolioData.financialRollup.escrowReserve.ratePercent === '10%', '10% reduced escrow hold awarded for 0 strikes');
    assert(portfolioData.financialRollup.taxCompliance.authority.includes('Ghana Revenue Authority'), 'Includes GRA Residential Rent Tax Compliance');
    assert(portfolioData.financialRollup.taxCompliance.statutoryRate === '8%', 'GRA 8% statutory rent withholding tax applied');
    assert(portfolioData.financialRollup.ghsEquivalents.netPayoutGhs > 0, 'Calculated local currency net landlord payout');

    console.log('\n====================================================');
    console.log(`🎯  QA SUMMARY: ${testsPassed}/${testsTotal} TESTS PASSED`);
    if (testsPassed === testsTotal) {
      console.log('🏆  PHASE 6 QUALITY CERTIFICATION: APPROVED');
    } else {
      console.error('⚠️  PHASE 6 QUALITY CERTIFICATION: FAILED');
      process.exit(1);
    }
    console.log('====================================================');
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runPhase6Tests();
