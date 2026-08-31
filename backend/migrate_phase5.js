const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://flexuser:flexpassword@localhost:5432/flexliving'
});

async function migrate() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'phase5_schema.sql'), 'utf-8');
    await pool.query(sql);
    console.log('✅ Phase 5 Schema Migrated Successfully via pg client');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
