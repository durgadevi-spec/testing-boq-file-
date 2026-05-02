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
      JOIN boq_projects p ON bi.version_id = p.id
      WHERE p.name ILIKE '%floor carpet%'
      LIMIT 1
    `);
    
    // Wait, the join was wrong. Fixed it.
    const res2 = await pool.query(`
      SELECT 
        p.name as project_name, 
        bi.table_data
      FROM boq_items bi
      JOIN boq_versions v ON bi.version_id = v.id
      JOIN boq_projects p ON v.project_id = p.id
      WHERE p.name ILIKE '%floor carpet%'
      LIMIT 1
    `);

    if (res2.rows.length > 0) {
      let td = res2.rows[0].table_data;
      if (typeof td === 'string') td = JSON.parse(td);
      console.log('Grand Total Column:', td.finalize_grand_total_column);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
