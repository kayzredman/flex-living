/**
 * QA Phase 5 Automated Test Suite
 * AI Dynamic Pricing & Diaspora Surge Engine
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

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('🛡️  QA AGENT: RUNNING PHASE 5 TEST SUITE');
  console.log('🚀  AI Dynamic Pricing & Diaspora Surge Engine');
  console.log(`🌐  Target Gateway: ${GATEWAY_URL}`);
  console.log('====================================================\n');

  try {
    // Test 1: Gateway Routing to Pricing Service
    console.log('Test 1: Gateway Routing to Pricing Service');
    const healthRes = await fetch(`${GATEWAY_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Gateway responds with 200 OK');
    assert(healthData.routes.pricing.includes('/v1/pricing'), 'Pricing route registered in Gateway');

    // Test 2: Fetch Listings to obtain a valid Property ID
    console.log('\nTest 2: Resolve Target Property via PostGIS');
    const listingRes = await fetch(`${GATEWAY_URL}/v1/listings?lat=5.58&lng=-0.17&radius_km=10`);
    const listings = await listingRes.json();
    assert(listings.length > 0, `Located target property in Accra: ${listings[0].title}`);
    const testPropertyId = listings[0].id;

    // Test 3: Query African Diaspora Calendar Events
    console.log('\nTest 3: Diaspora Calendar Events Query');
    const eventsRes = await fetch(`${GATEWAY_URL}/v1/pricing/diaspora-events`);
    const eventsData = await eventsRes.json();
    assert(eventsRes.status === 200, 'Diaspora events endpoint returned 200 OK');
    assert(Array.isArray(eventsData.events), 'Events list is an array');
    const decInGhana = eventsData.events.find(e => e.event_name.includes('December in Ghana'));
    assert(!!decInGhana, 'Found "December in Ghana (Detty December)" event');
    assert(parseFloat(decInGhana.surge_multiplier) === 1.85, 'Surge multiplier is 1.85x for December in Ghana');

    // Test 4: Dynamic Price Calculation - Peak December in Ghana Surge
    console.log('\nTest 4: Dynamic Price Calculation (Peak Diaspora Season)');
    const calcPeakRes = await fetch(
      `${GATEWAY_URL}/v1/pricing/calculate/${testPropertyId}?checkIn=2026-12-20&checkOut=2027-01-05&currency=USD`
    );
    const peakData = await calcPeakRes.json();
    assert(calcPeakRes.status === 200, 'Peak dynamic pricing calculated successfully');
    assert(peakData.pricing.surgeMultiplier === 1.85, 'Peak surge multiplier of 1.85x applied');
    assert(peakData.pricing.activeSurgeEvent.includes('December in Ghana'), 'Active event flagged as December in Ghana');
    assert(peakData.pricing.totalBadgePremium === '+43%', 'Badge premiums evaluated (+18% Solar, +12% Starlink, +8% Borehole, +5% Lock)');
    assert(peakData.pricing.monthly.amount > peakData.yieldOptimization.unverifiedStandardMonthlyUsd, 'Verified dynamic price exceeds unverified baseline');

    // Test 5: Dynamic Price Calculation - Off-Peak Baseline Season
    console.log('\nTest 5: Dynamic Price Calculation (Standard Off-Peak Season)');
    const calcOffPeakRes = await fetch(
      `${GATEWAY_URL}/v1/pricing/calculate/${testPropertyId}?checkIn=2026-03-10&checkOut=2026-03-25&currency=USD`
    );
    const offPeakData = await calcOffPeakRes.json();
    assert(calcOffPeakRes.status === 200, 'Off-peak dynamic pricing calculated successfully');
    assert(offPeakData.pricing.surgeMultiplier === 1.0, 'Standard seasonal multiplier (1.0x) applied');
    assert(offPeakData.pricing.monthly.amount < peakData.pricing.monthly.amount, 'Off-peak monthly rate is properly lower than December peak');

    // Test 6: Dynamic Price Calculation in Local Currency (GHS)
    console.log('\nTest 6: Multi-Currency Dynamic Calculation (GHS)');
    const calcGhsRes = await fetch(
      `${GATEWAY_URL}/v1/pricing/calculate/${testPropertyId}?checkIn=2026-12-20&checkOut=2027-01-05&currency=GHS`
    );
    const ghsData = await calcGhsRes.json();
    assert(ghsData.pricing.monthly.currency === 'GHS', 'Formatted in Ghanaian Cedis (GHS)');
    assert(ghsData.pricing.monthly.amount > 0, 'GHS dynamic monthly rate calculated');

    // Test 7: Landlord 12-Month Yield Optimization Analytics
    console.log('\nTest 7: Host 12-Month Yield Curve & Revenue Lift Analytics');
    const yieldRes = await fetch(`${GATEWAY_URL}/v1/pricing/yield-analytics/${testPropertyId}`);
    const yieldData = await yieldRes.json();
    assert(yieldRes.status === 200, 'Yield analytics returned 200 OK');
    assert(Array.isArray(yieldData.monthlyProjection), '12-month projection returned');
    assert(yieldData.monthlyProjection.length === 12, 'Includes all 12 calendar months');
    const decProjection = yieldData.monthlyProjection.find(m => m.month === 'Dec');
    assert(decProjection.surgeMultiplier === 1.85, 'December projected at 1.85x peak surge');

    console.log('\n====================================================');
    console.log(`🎯  QA SUMMARY: ${testsPassed}/${testsTotal} TESTS PASSED`);
    if (testsPassed === testsTotal) {
      console.log('🏆  PHASE 5 QUALITY CERTIFICATION: APPROVED');
    } else {
      console.error('⚠️  PHASE 5 QUALITY CERTIFICATION: FAILED');
      process.exit(1);
    }
    console.log('====================================================');
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runPhase5Tests();
