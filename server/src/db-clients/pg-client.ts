import { ConnectionOptions } from 'tls'
import { InternalServerErrorException } from '@nestjs/common'
import { Client } from 'pg'
import * as _ from 'lodash'
import { ClientInterface, ClientResource, QueryRow } from './client.interface'

const POSTGRES_COLUMN_TYPES = {
  bigint: 'number',
  bigserial: 'serial',
  'bit varying': 'bit',
  bytea: 'binary',
  character: 'text',
  'character varying': 'text',
  'double precision': 'number',
  integer: 'number',
  numeric: 'number',
  real: 'number',
  smallint: 'number',
  smallserial: 'serial',
  timetz: 'timezone',
  'time without time zone': 'timestamp',
  'time with time zone': 'timestamp',
  'timestamp without time zone': 'timestamp',
  'timestamp with time zone': 'timestamp',
}

export class PgClient implements ClientInterface {
  constructor(private readonly resource: ClientResource) {}

  client = new Client({
    host: this.resource.host,
    user: this.resource.username,
    password: this.resource.password,
    port: this.resource.port,
    database: this.resource.database,
    ssl: this.sslConfig,
  })

  private get sslConfig(): boolean | ConnectionOptions {
    if (this.resource.sslRequired) {
      if (this.resource.selfCertificate) {
        return {
          key: this.resource.clientKey,
          cert: this.resource.clientCertificate,
        }
      }

      return true
    }

    return false
  }

  async testConnection() {
    try {
      this.client.connect()
      this.client.query('SELECT NOW()')
    } catch (error) {
      return false
    } finally {
      this.client.end()
    }
  }

  async runQuery<T = QueryRow>(query: string) {
    try {
      this.client.connect()
      const start = Date.now()
      const result = await this.client.query<T>(query)
      const timeToRunQuery = Date.now() - start
      return {
        rows: result.rows ?? [],
        fields: result.fields?.map(field => ({ name: field.name })) ?? [],
        timeToRunQuery,
        numRows: result.rowCount,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    } finally {
      this.client.end()
    }
  }

  async getSchema() {
    const { rows } = await this.runQuery<{
      table_name: string
      column_name: string
      data_type: string
    }>(`
    SELECT
      tables.table_name,
      column_name,
      data_type
    FROM
      (
        SELECT
          pg_class.relname AS table_name,
          pg_class.reltuples AS rows_count
        FROM
          pg_class
          LEFT JOIN pg_namespace ON (pg_namespace.oid = pg_class.relnamespace)
        WHERE
          pg_namespace.nspname NOT IN ('pg_catalog', 'information_schema')
          AND pg_class.relkind = 'r'
      ) AS tables
      JOIN information_schema.columns AS columns ON tables.table_name = columns.table_name;
    `)

    const tablesGroup = _.groupBy(rows, row => row.table_name)

    return _.orderBy(
      Object.keys(tablesGroup).map(tableName => ({
        name: tableName,
        columns: tablesGroup[tableName].map(item => ({
          name: item.column_name,
          type: POSTGRES_COLUMN_TYPES[item.data_type],
        })),
      })),
      table => table.name,
    )
  }

  async fetchTableSampleData(tableName: string) {
    return this.runQuery(`SELECT * FROM ${tableName} LIMIT 10`)
  }
}
