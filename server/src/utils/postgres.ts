import { Pool } from 'pg'

type Connection = {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export function createPostgresConnectionPool(connection: Connection) {
  const pool = new Pool({
    host: connection.host,
    user: connection.username,
    password: connection.password,
    port: connection.port,
    database: connection.database,
  })
  return pool
}
