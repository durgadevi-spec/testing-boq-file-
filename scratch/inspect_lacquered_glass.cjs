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
        v.status as version_status,
        bi.table_data
      FROM boq_items bi
      JOIN boq_versions v ON bi.version_id = v.id
      JOIN boq_projects p ON v.project_id = p.id
      WHERE p.name ILIKE '%Lacquered Glass%'
      ORDER BY v.updated_at DESC
    `);

    console.log(`Found ${res.rows.length} items for 'Lacquered Glass'`);
    res.rows.forEach((row, i) => {
      let td = row.table_data;
      if (typeof td === 'string') td = JSON.parse(td);
      const vals = td.finalize_column_values?.['0'] || {};
      
      console.log(`\n--- Item ${i+1} ---`);
      console.log(`Project: ${row.project_name} (Status: ${row.version_status})`);
      console.log(`Columns:`, JSON.stringify(td.finalize_columns));
      console.log(`Values:`, JSON.stringify(vals));
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
