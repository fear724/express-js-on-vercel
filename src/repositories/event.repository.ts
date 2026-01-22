import { getPool } from '../db/postgres.js'
import { Event } from '../models/event.js'

export async function saveEvent(event: Event): Promise<void> {
  const pool = getPool()

  await pool.query(
    `
    INSERT INTO events (id, text, datetime)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO NOTHING
    `,
    [event.id, event.text, event.datetime]
  )
}

export async function findAllEvents(): Promise<Event[]> {
  const pool = getPool()

  const { rows } = await pool.query(
    `
    SELECT id, text, datetime
    FROM events
    ORDER BY datetime DESC
    `
  )

  return rows
}
