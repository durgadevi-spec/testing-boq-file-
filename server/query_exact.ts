import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres.kfbquadkplnnqovsbnji:Durga%219Qx%407B%2325Lm@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require', ssl: { rejectUnauthorized: false } });
pool.query(`SELECT p.name, bi.table_data FROM boq_items bi JOIN boq_versions v ON bi.version_id = v.id JOIN boq_projects p ON v.project_id = p.id WHERE p.name ILIKE '%Lacquered Glass in Conf Room%'`)
  .then(res => { res.rows.forEach(r => console.log(JSON.stringify(r.table_data))); pool.end(); })
  .catch(console.error);
