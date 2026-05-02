import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres.kfbquadkplnnqovsbnji:Durga%219Qx%407B%2325Lm@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require', ssl: { rejectUnauthorized: false } });
pool.query(`SELECT p.name, bi.table_data FROM boq_items bi JOIN boq_versions v ON bi.version_id = v.id JOIN boq_projects p ON v.project_id = p.id WHERE p.name ILIKE '%Lacquered Glass in Conf Room%' AND bi.table_data->>'product_id' = 'bdaa4dbe-084f-40c1-a3f3-75779b3e34b9'`)
  .then(res => { console.log(JSON.stringify(res.rows, null, 2)); pool.end(); })
  .catch(console.error);
