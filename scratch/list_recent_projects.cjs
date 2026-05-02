const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT id, name FROM boq_projects ORDER BY updated_at DESC LIMIT 5
    `);

    res.rows.forEach(r => console.log(`ID: ${r.id}, Name: ${r.name}`));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
