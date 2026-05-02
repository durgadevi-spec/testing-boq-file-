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
    `);

    res.rows.forEach((row) => {
      let td = row.table_data;
      if (typeof td === 'string') td = JSON.parse(td);
      const vals = td.finalize_column_values?.['0'] || {};
      
      const v5800 = Object.values(vals).some(v => parseFloat(String(v)) === 5800);
      const v5000 = Object.values(vals).some(v => parseFloat(String(v)) === 5000);
      
      if (v5800 || v5000) {
        console.log(`\nFound target in Project: ${row.project_name}`);
        console.log(`Values:`, JSON.stringify(vals));
        console.log(`Override Rate: ${td.finalize_override_rate}`);
        console.log(`Finalize Rate: ${td.finalize_rate}`);
      }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
