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

    console.log(`Found ${res.rows.length} total items for 'floor carpet'`);
    const projects = {};
    
    res.rows.forEach((row) => {
      let td = row.table_data;
      if (typeof td === 'string') td = JSON.parse(td);
      const projName = row.project_name;
      if (!projects[projName]) projects[projName] = new Set();
      
      const cols = td.finalize_columns || [];
      cols.forEach(c => {
        projects[projName].add(typeof c === 'string' ? c : c.name);
      });
    });

    Object.keys(projects).forEach(p => {
      console.log(`Project: ${p}`);
      console.log(`Unique Columns:`, Array.from(projects[p]));
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
