const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function run() {
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  let dbUrl = process.env.DATABASE_URL;
  const match1 = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match1) dbUrl = match1[1];
  else {
    const match2 = envContent.match(/DATABASE_URL=(.+)$/m);
    if (match2) dbUrl = match2[1].trim();
  }

  console.log("Connecting to:", dbUrl.substring(0, 50) + "...");
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("Connected to DB. Creating indexes...");
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sketch_items_plan_id ON sketch_plan_items(plan_id);`);
    console.log("Added idx_sketch_items_plan_id");

    await client.query(`CREATE INDEX IF NOT EXISTS idx_sketch_items_material_id ON sketch_plan_items(material_id);`);
    console.log("Added idx_sketch_items_material_id");
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sketch_items_assigned_user ON sketch_plan_items(assigned_user_id);`);
    console.log("Added idx_sketch_items_assigned_user");

    client.release();
    console.log("Success.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}
run();
