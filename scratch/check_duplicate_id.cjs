const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT 
        p.name as project_name, 
        bi.table_data
      FROM boq_items bi
      JOIN boq_versions v ON bi.version_id = v.id
      JOIN boq_projects p ON v.project_id = p.id
      WHERE (bi.table_data->>'material_id' = '29000bd6-e823-4a6f-a129-d5cdfa2abec7')
    `);

    res.rows.forEach(r => {
      const td = typeof r.table_data === 'string' ? JSON.parse(r.table_data) : r.table_data;
      console.log(`Project: ${r.project_name}, Name: ${td.product_name}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
