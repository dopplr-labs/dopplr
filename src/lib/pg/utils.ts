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

type PGConfig = {
  dbUsername: string
  dbPassword: string
  host: string
  port: number
  database: string
}

export function extractConfigFromUrl(url: string): PGConfig | null {
  const regex = PG_URL_REGEX
  const match = url.match(regex)

  if (match) {
    return {
      dbUsername: decodeURIComponent(match[1]),
      dbPassword: decodeURIComponent(match[2]),
      host: decodeURIComponent(match[3]),
      port: parseInt(match[4]),
      database: decodeURIComponent(match[5]),
    }
  }

  return null
}
