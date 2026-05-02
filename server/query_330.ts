import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres.kfbquadkplnnqovsbnji:Durga%219Qx%407B%2325Lm@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require', ssl: { rejectUnauthorized: false } });
pool.query(`SELECT table_data FROM boq_items WHERE table_data::text LIKE '%330.41%'`)
  .then(res => { console.log(JSON.stringify(res.rows, null, 2)); pool.end(); })
  .catch(console.error);
