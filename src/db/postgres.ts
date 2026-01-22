import pg, { type Pool as PgPool } from 'pg'

let pool: PgPool | null = null

export function getPool(): PgPool {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  }
  return pool
}
