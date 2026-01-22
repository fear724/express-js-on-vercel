import pg from 'pg';
let pool = null;
export function getPool() {
    if (!pool) {
        pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    return pool;
}
