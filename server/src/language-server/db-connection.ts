// Create a Common DB Connection library both
// the language server and the client can use

import { Client, ClientConfig } from 'pg'

export class PgClient extends Client {
  // eslint-disable-next-line camelcase
  pg_version: number
  // eslint-disable-next-line camelcase
  is_ended: boolean

  constructor(config?: string | ClientConfig) {
    super(config)

    this.is_ended = false
    this.on('end', () => {
      this.is_ended = true
    })
  }
}
