import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

const client = postgres(process.env.DATABASE_URL!)

const globalForDb = globalThis as unknown as {
  db: PostgresJsDatabase
}

export const db = globalForDb.db ?? drizzle(client)

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
