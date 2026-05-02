const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT id, name FROM boq_projects WHERE name ILIKE '%floor carpet%'
    `);

    console.log(`Found ${res.rows.length} projects matching 'floor carpet'`);
    res.rows.forEach(r => console.log(`ID: ${r.id}, Name: ${r.name}`));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
