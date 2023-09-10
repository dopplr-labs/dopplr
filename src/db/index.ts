import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

const client = postgres(process.env.DATABASE_URL!)

const globalForPrisma = globalThis as unknown as {
  db: PostgresJsDatabase
}

export const db = globalForPrisma.db ?? drizzle(client)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.db = db
}
