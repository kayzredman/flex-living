require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'scout-engine' });
});

/**
 * POST /v1/scout/tasks
 * Dispatch an audit task for a property
 */
app.post('/v1/scout/tasks', async (req, res) => {
  try {
    const { propertyId, scoutId, basePayoutUsd = 25.0 } = req.body;
    if (!propertyId) {
      return res.status(400).json({ error: 'propertyId is required' });
    }

    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    const validScoutUuid = (scoutId && uuidRegex.test(scoutId)) ? scoutId : null;
    const validPropUuid = (propertyId && uuidRegex.test(propertyId)) ? propertyId : null;

    if (!validPropUuid) {
      return res.status(400).json({ error: 'propertyId must be a valid UUID' });
    }

    const result = await pool.query(
      `INSERT INTO scout_tasks (property_id, scout_id, base_payout_usd, total_payout_usd, status)
       VALUES ($1, $2, $3, $3, 'PENDING')
       RETURNING *`,
      [validPropUuid, validScoutUuid, basePayoutUsd]
    );

    res.status(201).json({
      message: 'Scout audit task dispatched successfully',
      task: result.rows[0]
    });
  } catch (err) {
    console.error('Error dispatching scout task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/scout/tasks
 * Query scout audit tasks
 */
app.get('/v1/scout/tasks', async (req, res) => {
  try {
    const { propertyId, status, scoutId } = req.query;
    let query = 'SELECT * FROM scout_tasks WHERE 1=1';
    const params = [];

    if (propertyId) {
      params.push(propertyId);
      query += ` AND property_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (scoutId) {
      params.push(scoutId);
      query += ` AND scout_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json({ tasks: result.rows });
  } catch (err) {
    console.error('Error querying scout tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/scout/tasks/:id/submit
 * Scout submits 200+ checklist telemetry & verification proof
 */
app.post('/v1/scout/tasks/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { checklistData, reviewNotes } = req.body;

    if (!checklistData) {
      return res.status(400).json({ error: 'checklistData is required' });
    }

    const taskCheck = await pool.query('SELECT * FROM scout_tasks WHERE id = $1', [id]);
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Audit task not found' });
    }

    const result = await pool.query(
      `UPDATE scout_tasks
       SET checklist_data = $1, review_notes = $2, status = 'SUBMITTED', updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [JSON.stringify(checklistData), reviewNotes || null, id]
    );

    res.status(200).json({
      message: 'Audit checklist submitted successfully',
      task: result.rows[0]
    });
  } catch (err) {
    console.error('Error submitting scout checklist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/scout/tasks/:id/verify
 * Auto-evaluates audit criteria, awards Flex-Trust Badges, computes scout payout
 */
app.post('/v1/scout/tasks/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const taskQuery = await pool.query('SELECT * FROM scout_tasks WHERE id = $1', [id]);
    if (taskQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Audit task not found' });
    }

    const task = taskQuery.rows[0];
    const data = task.checklist_data || {};

    const awardedBadges = [];
    let bonusPayout = 0.0;

    // 1. Solar & Power Verification
    if (data.solar_backup === true && (data.solar_inverter_kva || 0) >= 3.0) {
      awardedBadges.push('SOLAR_VERIFIED');
    }

    // 2. High-Speed Internet / Starlink Verification
    if (data.starlink_present === true && (data.starlink_download_mbps || 0) >= 100) {
      awardedBadges.push('STARLINK_VERIFIED');
    }

    // 3. Water Security / Borehole Verification
    if (data.borehole_present === true) {
      awardedBadges.push('BOREHOLE_VERIFIED');
    }

    // 4. Smart Access / Digital Lock
    if (data.smart_lock_functional === true) {
      awardedBadges.push('SMART_ACCESS_VERIFIED');
    }

    // Bonus Calculation: If high quality photos + multi-badge criteria met
    const photosCount = Array.isArray(data.photo_audit_urls) ? data.photo_audit_urls.length : (data.photos_count || 0);
    if (photosCount >= 5 && awardedBadges.length >= 2) {
      bonusPayout = 10.0; // $10 accuracy & detail bonus
    }

    const basePayout = parseFloat(task.base_payout_usd) || 25.0;
    const totalPayout = basePayout + bonusPayout;

    // Calculate Flex-Trust Score boost
    const flexTrustScore = Math.min(100, 70 + (awardedBadges.length * 7.5));

    // Update Task Record
    const updatedTask = await pool.query(
      `UPDATE scout_tasks
       SET awarded_badges = $1, bonus_payout_usd = $2, total_payout_usd = $3, status = 'APPROVED', updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [JSON.stringify(awardedBadges), bonusPayout, totalPayout, id]
    );

    // Sync badges & trust score directly into the listings table
    await pool.query(
      `UPDATE listings
       SET badges = $1, flex_trust_score = $2
       WHERE id = $3`,
      [JSON.stringify(awardedBadges), Math.round(flexTrustScore), task.property_id]
    );

    res.status(200).json({
      message: 'Scout audit certified and Flex-Trust Badges issued',
      task: updatedTask.rows[0],
      awardedBadges,
      payout: {
        basePayoutUsd: basePayout,
        bonusPayoutUsd: bonusPayout,
        totalPayoutUsd: totalPayout
      },
      updatedPropertyTrustScore: Math.round(flexTrustScore)
    });
  } catch (err) {
    console.error('Error verifying audit task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const { scanPropertyWithAI } = require('./ai_scanner');

/**
 * POST /v1/scout/ai-scan
 * Run AI Vision inspection on property photos and telemetry
 */
app.post('/v1/scout/ai-scan', async (req, res) => {
  try {
    const { propertyId, images = [], telemetry = {} } = req.body;
    
    // Execute AI Vision Model
    const scanReport = scanPropertyWithAI({ propertyId, images, telemetry });

    // If pre-certified and propertyId exists, update listing in DB
    if (scanReport.instantPreCertified && propertyId) {
      try {
        await pool.query(
          `UPDATE listings
           SET badges = $1, flex_trust_score = $2
           WHERE id = $3`,
          [JSON.stringify(scanReport.awardedBadges), scanReport.qualityScore, propertyId]
        );
      } catch (dbErr) {
        console.warn('Listing DB update skipped or non-existent propertyId:', dbErr.message);
      }
    }

    res.status(200).json({
      message: scanReport.instantPreCertified 
        ? 'AI Vision Property Pre-Certification Approved!' 
        : 'AI Vision Scan Complete - Field Scout Spot-Check Scheduled',
      scanReport
    });
  } catch (err) {
    console.error('Error executing AI vision property scan:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /v1/scout/dashboard
 * Aggregated statistics and task queue for Scout Operations & Field Agents
 */
app.get('/v1/scout/dashboard', async (req, res) => {
  try {
    const tasksRes = await pool.query('SELECT * FROM scout_tasks ORDER BY created_at DESC LIMIT 50');
    const tasks = tasksRes.rows || [];

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
    const approvedTasks = tasks.filter(t => t.status === 'APPROVED' || t.status === 'CERTIFIED').length;
    const totalBountiesUsd = tasks.reduce((sum, t) => sum + (parseFloat(t.total_payout_usd) || 0), 0);

    const scoutRoster = [
      { id: 'scout-accra-01', name: 'Ama Mensah', city: 'Accra, Ghana', completedAudits: 28, rating: 4.96, activeBountyGhs: 4200 },
      { id: 'scout-lagos-01', name: 'Chinedu Okafor', city: 'Lagos, Nigeria', completedAudits: 34, rating: 4.92, activeBountyGhs: 5100 },
      { id: 'scout-nairobi-01', name: 'Njeri Kamau', city: 'Nairobi, Kenya', completedAudits: 22, rating: 4.98, activeBountyGhs: 3300 }
    ];

    res.status(200).json({
      summary: {
        totalInspections: totalTasks,
        pendingInspections: pendingTasks,
        certifiedProperties: approvedTasks,
        totalBountiesDistributedUsd: totalBountiesUsd,
        avgAuditTurnaroundHours: 3.2
      },
      scoutRoster,
      recentTasks: tasks.slice(0, 10)
    });
  } catch (err) {
    console.error('Error fetching scout dashboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Flex-Living Field Scout Engine running on port ${PORT}`);
});
