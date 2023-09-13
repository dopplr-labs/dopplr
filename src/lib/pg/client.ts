import postgres from 'postgres'

const _connectionCaches = new Map<string, postgres.Sql>()
/**
 * Returns a cached postgres client for a given connection string.
 *
 * @param connectionString - The connection string to use
 * @returns The cached postgres client
 */
export function getPgClientForConnectionString(connectionString: string) {
  if (!_connectionCaches.get(connectionString)) {
    _connectionCaches.set(connectionString, postgres(connectionString))
  }
  return _connectionCaches.get(connectionString)
}
