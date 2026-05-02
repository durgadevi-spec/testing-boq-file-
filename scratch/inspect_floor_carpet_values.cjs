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
      WHERE p.name ILIKE '%floor carpet%'
    `);

    res.rows.forEach((row) => {
      let td = row.table_data;
      if (typeof td === 'string') td = JSON.parse(td);
      const vals = td.finalize_column_values?.['0'] || {};
      
      const supply = vals['Supply Rate'];
      const labour = vals['Labour Rate'];
      const rateItem = vals['Rate/Item'];
      
      if (supply || labour || rateItem) {
        console.log(`Item in ${row.project_name}:`);
        console.log(`  Supply Rate: ${supply}`);
        console.log(`  Labour Rate: ${labour}`);
        console.log(`  Rate/Item: ${rateItem}`);
        console.log(`  Columns: ${JSON.stringify(td.finalize_columns)}`);
      }
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
