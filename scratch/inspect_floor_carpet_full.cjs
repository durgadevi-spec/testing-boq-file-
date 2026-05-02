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
      LIMIT 1
    `);

    if (res.rows.length > 0) {
      console.log(JSON.stringify(res.rows[0].table_data, null, 2));
    } else {
      console.log("No Floor Carpet project found");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
