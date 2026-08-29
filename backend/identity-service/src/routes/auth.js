const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Store OTPs in memory for the mock (In production, use Redis)
const otpStore = new Map();

/**
 * POST /v1/auth/register
 * Generates an OTP for the given phone number
 */
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Mock OTP generation
    const otp = '123456'; // Static for demo purposes
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Mocking SMS delivery
    console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`);

    res.status(200).json({
      message: 'OTP sent successfully',
      debug: { otp } // Included for demo testing
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/auth/verify-otp
 * Verifies the OTP and issues a JWT. Creates a new user if one doesn't exist.
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const record = otpStore.get(phoneNumber);

    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid, clear it
    otpStore.delete(phoneNumber);

    // Check if user exists
    const userQuery = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
    let user = userQuery.rows[0];

    if (!user) {
      // Create user
      const insertQuery = await pool.query(
        'INSERT INTO users (phone_number, full_name) VALUES ($1, $2) RETURNING *',
        [phoneNumber, 'New User']
      );
      user = insertQuery.rows[0];
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, kycTier: user.kyc_tier },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /v1/auth/kyc
 * Mocks the KYC verification process (Smile Identity / Ghana Card).
 */
router.post('/kyc', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { documentType, documentNumber } = req.body;
    
    if (!documentType || !documentNumber) {
      return res.status(400).json({ error: 'Document type and number are required' });
    }

    // Mock verification (e.g. valid if it starts with GHA)
    let status = 'REJECTED';
    let kycTier = 0;
    
    if (documentNumber.startsWith('GHA-')) {
      status = 'VERIFIED';
      kycTier = 2; // Tier 2 for verified Ghana Card
    } else {
       return res.status(400).json({ error: 'Invalid Document Number. Must start with GHA-' });
    }

    // Upsert KYC Profile
    await pool.query(
      `INSERT INTO kyc_profiles (user_id, document_type, status, verified_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (user_id) DO UPDATE SET document_type = $2, status = $3, verified_at = NOW()`,
      [userId, documentType, status]
    );

    // Update User Tier
    await pool.query(
      'UPDATE users SET kyc_tier = $1 WHERE id = $2',
      [kycTier, userId]
    );

    res.status(200).json({
      message: 'KYC Verification successful',
      kycTier,
      status
    });
  } catch (error) {
    console.error('KYC error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
