const assert = require('assert');

async function runQAScoutAITests() {
  console.log('🧪 Starting QA Automated Certification: Field Scout Engine & AI Vision Scanner...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  // TEST 1: Health Check
  await test('Scout Service Health Check (:3001)', async () => {
    const res = await fetch('http://localhost:3001/health');
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.service, 'scout-engine');
  });

  // TEST 2: Dispatch Scout Task
  let createdTaskId = null;
  await test('Dispatch 200-Point Scout Task (POST /v1/scout/tasks)', async () => {
    const res = await fetch('http://localhost:3001/v1/scout/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: 'd840a121-06fc-40e4-be13-8f2823d82036',
        scoutId: 'c8f75faa-392d-4bd6-a782-554b2989c03a',
        basePayoutUsd: 50.0
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.task.id);
    assert.strictEqual(data.task.status, 'PENDING');
    createdTaskId = data.task.id;
  });

  // TEST 3: Submit 200-Point Audit Checklist
  await test('Submit Scout Checklist Telemetry (POST /v1/scout/tasks/:id/submit)', async () => {
    assert.ok(createdTaskId, 'Task ID required');
    const res = await fetch(`http://localhost:3001/v1/scout/tasks/${createdTaskId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checklistData: {
          solar_backup: true,
          solar_inverter_kva: 10.0,
          ats_switchover_seconds: 6.2,
          generator_noise_db: 38,
          starlink_present: true,
          starlink_download_mbps: 185,
          borehole_present: true,
          water_tds_ppm: 65,
          smart_lock_functional: true,
          photos_count: 6
        },
        reviewNotes: 'Victron MultiPlus-II 10kVA with 15kWh LiFePO4 verified. Starlink latency 26ms.'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.task.status, 'SUBMITTED');
  });

  // TEST 4: Certify Audit & Award Badges
  await test('Certify Audit & Issue Flex-Trust Badges (POST /v1/scout/tasks/:id/verify)', async () => {
    assert.ok(createdTaskId, 'Task ID required');
    const res = await fetch(`http://localhost:3001/v1/scout/tasks/${createdTaskId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.task.status, 'APPROVED');
    assert.ok(data.awardedBadges.includes('SOLAR_VERIFIED'));
    assert.ok(data.awardedBadges.includes('STARLINK_VERIFIED'));
    assert.ok(data.awardedBadges.includes('BOREHOLE_VERIFIED'));
    assert.ok(data.awardedBadges.includes('SMART_ACCESS_VERIFIED'));
    assert.strictEqual(data.payout.totalPayoutUsd, 60.0); // $50 base + $10 bonus
  });

  // TEST 5: AI Vision Property Scanner
  await test('AI Vision Property Scanner (POST /v1/scout/ai-scan)', async () => {
    const res = await fetch('http://localhost:3001/v1/scout/ai-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: 'd840a121-06fc-40e4-be13-8f2823d82036',
        images: [
          { tag: 'solar_inverter_board', url: 'https://images.unsplash.com/photo-victron' },
          { tag: 'starlink_dish_antenna', url: 'https://images.unsplash.com/photo-starlink' }
        ],
        telemetry: {
          inverterKva: 10,
          downloadMbps: 180,
          waterTanksLiters: 5000,
          smartLock: true
        }
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.scanReport.overallConfidenceScore >= 90);
    assert.strictEqual(data.scanReport.instantPreCertified, true);
    assert.strictEqual(data.scanReport.verificationTier, 'AI_CERTIFIED_GOLD');
    assert.strictEqual(data.scanReport.dynamicYieldLiftPct, '+43%');
    assert.strictEqual(data.scanReport.detectedEquipment.length, 4);
  });

  // TEST 6: Scout Dashboard Aggregation
  await test('Field Scout Dashboard Aggregation (GET /v1/scout/dashboard)', async () => {
    const res = await fetch('http://localhost:3001/v1/scout/dashboard');
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.summary.totalInspections > 0);
    assert.ok(data.scoutRoster.length >= 3);
  });

  // TEST 7: Onboard New Field Scout (POST /v1/scout/onboard)
  let newlyOnboardedScoutId = null;
  await test('Onboard New Field Scout (POST /v1/scout/onboard)', async () => {
    const res = await fetch('http://localhost:3001/v1/scout/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Samuel Osei Tutu',
        phone: '+233 55 777 8899',
        city: 'Accra',
        nationalId: 'GHA-918230192-3',
        zones: ['Cantonments', 'Osu']
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.scout.id);
    assert.strictEqual(data.scout.status, 'ACTIVE');
    newlyOnboardedScoutId = data.scout.id;
  });

  // TEST 8: Yank Rogue Scout (PATCH /v1/scout/:id/status with YANKED)
  await test('Yank Rogue Scout Credentials (PATCH /v1/scout/:id/status -> YANKED)', async () => {
    assert.ok(newlyOnboardedScoutId, 'Scout ID required');
    const res = await fetch(`http://localhost:3001/v1/scout/${newlyOnboardedScoutId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'YANKED',
        reason: 'Fraudulent power telemetry reported on Cantonments audit'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.scout.status, 'YANKED');
    assert.strictEqual(data.scout.lastStatusUpdate.reason, 'Fraudulent power telemetry reported on Cantonments audit');
  });

  // TEST 9: Reinstate Scout (PATCH /v1/scout/:id/status -> ACTIVE)
  await test('Reinstate Scout Credentials (PATCH /v1/scout/:id/status -> ACTIVE)', async () => {
    assert.ok(newlyOnboardedScoutId, 'Scout ID required');
    const res = await fetch(`http://localhost:3001/v1/scout/${newlyOnboardedScoutId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'ACTIVE',
        reason: 'Audit re-calibrated with verified True-RMS multimeter'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.scout.status, 'ACTIVE');
  });

  console.log(`\n========================================`);
  console.log(`  QA Certification: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runQAScoutAITests();
