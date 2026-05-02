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
      
      Object.entries(vals).forEach(([colName, val]) => {
        if (parseFloat(String(val)) === 5800) {
          console.log(`\nFound 5800 in Project: ${row.project_name}`);
          console.log(`Column: ${colName}`);
          console.log(`Item Data Keys: ${Object.keys(td)}`);
          console.log(`Product ID: ${td.product_id}`);
          console.log(`Material ID: ${td.material_id}`);
          console.log(`Full Values for this item:`, JSON.stringify(vals));
          console.log(`Full Columns for this item:`, JSON.stringify(td.finalize_columns));
        }
      });
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
