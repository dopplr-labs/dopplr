export const PG_URL_REGEX =
  /^postgresql:\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d{1,5}))?(?:\/(\w+))?(?:\?[a-zA-Z0-9%_\-=&]*)?$/

export function createUrlFromConfig({
  host,
  port,
  dbUsername,
  dbPassword,
  database,
}: {
  host: string
  port: number
  dbUsername: string
  dbPassword: string
  database: string
}) {
  return `postgresql://${encodeURIComponent(dbUsername)}:${encodeURIComponent(dbPassword)}@${encodeURIComponent(
    host,
  )}:${encodeURIComponent(port)}/${database}`
}
