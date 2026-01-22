import { getPool } from '../db/postgres.js';
export async function saveEvent(event) {
    const pool = getPool();
    await pool.query(`
    INSERT INTO events (id, text, datetime)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO NOTHING
    `, [event.id, event.text, event.datetime]);
}
export async function findAllEvents() {
    const pool = getPool();
    const { rows } = await pool.query(`
    SELECT id, text, datetime
    FROM events
    ORDER BY datetime DESC
    `);
    return rows;
}
