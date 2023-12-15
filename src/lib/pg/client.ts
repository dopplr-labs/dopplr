import postgres from 'postgres'

const globalForCache = globalThis as unknown as {
  pgConnectionsCache: Map<string, postgres.Sql>
}

const _connectionCaches = globalForCache.pgConnectionsCache ?? new Map<string, postgres.Sql>()
if (process.env.NODE_ENV !== 'production') {
  globalForCache.pgConnectionsCache = _connectionCaches
}

/**
 * Returns a cached postgres client for a given connection string.
 *
 * @param connectionString - The connection string to use
 * @returns The cached postgres client
 */
export function getPgClientForConnectionString(connectionString: string) {
  if (!_connectionCaches.get(connectionString)) {
    // eslint-disable-next-line no-console
    console.warn('creating a new client for connection ', connectionString, _connectionCaches)

    _connectionCaches.set(connectionString, postgres(connectionString))
  }
  return _connectionCaches.get(connectionString)!
}
