import 'dotenv/config'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  const connection = postgres(process.env.DATABASE_URL, { max: 1 })

  const db = drizzle(connection)

  // eslint-disable-next-line no-console
  console.log('⏳ Running migrations...')

  const start = Date.now()

  await migrate(db, { migrationsFolder: 'src/db/migrations' })

  const end = Date.now()

  // eslint-disable-next-line no-console
  console.log('✅ Migrations completed in', end - start, 'ms')

  process.exit(0)
}

runMigrate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Migration failed')
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
