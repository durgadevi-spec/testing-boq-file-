import pg from 'pg';
const { Pool } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
    connectionString: "postgresql://postgres.kfbquadkplnnqovsbnji:Durga%219Qx%407B%2325Lm@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",
    ssl: { rejectUnauthorized: false }
});

async function inspectTable() {
    try {
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'products'
        `);
        console.log("Columns in products:");
        columns.rows.forEach(col => console.log(` - ${col.column_name}: ${col.data_type}`));

        const constraints = await pool.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE conrelid = 'products'::regclass
        `);
        console.log("\nConstraints in products:");
        constraints.rows.forEach(con => console.log(` - ${con.conname}: ${con.pg_get_constraintdef}`));

    } catch (err) {
        console.error("Failed to inspect table:", err.message);
    } finally {
        await pool.end();
    }
}

inspectTable();
