import mysql2 from 'mysql2/promise'

const globalForCache = globalThis as unknown as {
  mySqlConnectionsCache: Map<
    string,
    {
      promise?: Promise<mysql2.Connection>
      connection?: mysql2.Connection
    }
  >
}

const _connectionCaches = globalForCache.mySqlConnectionsCache ?? new Map<string, mysql2.Connection>()
if (process.env.NODE_ENV !== 'production') {
  globalForCache.mySqlConnectionsCache = _connectionCaches
}

/**
 * Returns a cached mysql client for a given connection string.
 *
 * @param connectionString - The connection string to use
 * @returns The cached mysql client
 */
export async function getMySqlClientForConnectionString(connectionString: string) {
  // Check if we have cached connection for this connection string
  if (!_connectionCaches.get(connectionString)) {
    // eslint-disable-next-line no-console
    console.warn('creating a new client for connection ', connectionString, _connectionCaches)

    _connectionCaches.set(connectionString, {
      promise: mysql2.createConnection({ uri: connectionString }),
    })
  }

  // Check if promise is resolved to a connection
  if (!_connectionCaches.get(connectionString)?.connection) {
    _connectionCaches.set(connectionString, {
      connection: await _connectionCaches.get(connectionString)?.promise,
    })
  }

  return _connectionCaches.get(connectionString)!.connection!
}
