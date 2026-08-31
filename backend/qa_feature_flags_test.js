/**
 * Flex-Living Granular Feature Flags QA Test Suite
 * Validates the 20 remote config switches, presets, and real-time synchronization.
 */

const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Flex-Living Feature Flags QA Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
    }
  }

  try {
    // Test 1: Fetch active flags
    const res1 = await request({
      hostname: 'localhost',
      port: 3004,
      path: '/v1/config/flags',
      method: 'GET'
    });

    assert('GET /v1/config/flags returns 200 OK', res1.status === 200);
    assert('Returns success: true', res1.data.success === true);
    assert('Returns all 20 granular flags', Object.keys(res1.data.flags).length >= 20);
    assert('Returns rich metadata for all flags', Object.keys(res1.data.metadata).length >= 20);
    assert('Includes presets list', Array.isArray(res1.data.presets) && res1.data.presets.includes('MARKET_BASELINE'));

    // Test 2: Apply MARKET_BASELINE Preset
    const res2 = await request({
      hostname: 'localhost',
      port: 3004,
      path: '/v1/config/flags',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }, { preset: 'MARKET_BASELINE' });

    assert('PATCH preset MARKET_BASELINE returns 200', res2.status === 200);
    assert('activePreset is MARKET_BASELINE', res2.data.activePreset === 'MARKET_BASELINE');
    assert('MARKET_BASELINE turns OFF 200_POINT_TELEMETRY', res2.data.flags.FLAG_200_POINT_TELEMETRY === false);
    assert('MARKET_BASELINE turns OFF FLEX_ADVANCE_MONTHLY', res2.data.flags.FLAG_FLEX_ADVANCE_MONTHLY === false);
    assert('MARKET_BASELINE turns OFF MOMO_USSD_PUSH', res2.data.flags.FLAG_MOMO_USSD_PUSH === false);
    assert('MARKET_BASELINE turns OFF SLA_2HR_CURE_TIMER', res2.data.flags.FLAG_SLA_2HR_CURE_TIMER === false);
    assert('MARKET_BASELINE turns OFF CARETAKER_WHATSAPP_BOT', res2.data.flags.FLAG_CARETAKER_WHATSAPP_BOT === false);
    assert('MARKET_BASELINE keeps VERIFIED_BADGES ON', res2.data.flags.FLAG_VERIFIED_BADGES === true);

    // Test 3: Apply FINTECH_ESCROW Preset
    const res3 = await request({
      hostname: 'localhost',
      port: 3004,
      path: '/v1/config/flags',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }, { preset: 'FINTECH_ESCROW' });

    assert('PATCH preset FINTECH_ESCROW returns 200', res3.status === 200);
    assert('FINTECH_ESCROW enables FLEX_ADVANCE_MONTHLY', res3.data.flags.FLAG_FLEX_ADVANCE_MONTHLY === true);
    assert('FINTECH_ESCROW enables MOMO_USSD_PUSH', res3.data.flags.FLAG_MOMO_USSD_PUSH === true);
    assert('FINTECH_ESCROW enables HOST_ESCROW_VAULT', res3.data.flags.FLAG_HOST_ESCROW_VAULT === true);
    assert('FINTECH_ESCROW enables SMILEID_BIOMETRICS', res3.data.flags.FLAG_SMILEID_BIOMETRICS === true);
    assert('FINTECH_ESCROW keeps SLA_2HR_CURE_TIMER disabled', res3.data.flags.FLAG_SLA_2HR_CURE_TIMER === false);

    // Test 4: Granular Single Flag Toggle
    const res4 = await request({
      hostname: 'localhost',
      port: 3004,
      path: '/v1/config/flags',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }, { flags: { FLAG_SLA_2HR_CURE_TIMER: true } });

    assert('PATCH granular flag toggle returns 200', res4.status === 200);
    assert('Granular flag toggle sets SLA_2HR_CURE_TIMER to true', res4.data.flags.FLAG_SLA_2HR_CURE_TIMER === true);
    assert('activePreset switches to CUSTOM', res4.data.activePreset === 'CUSTOM');

    // Test 5: Reset to Defaults (FULL_FLEX)
    const res5 = await request({
      hostname: 'localhost',
      port: 3004,
      path: '/v1/config/flags/reset',
      method: 'POST'
    });

    assert('POST /v1/config/flags/reset returns 200', res5.status === 200);
    assert('Reset restores activePreset to FULL_FLEX', res5.data.activePreset === 'FULL_FLEX');
    assert('Reset enables all 20 flags', Object.values(res5.data.flags).every(v => v === true));

    console.log(`\n🎉 Results: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)\n`);
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
