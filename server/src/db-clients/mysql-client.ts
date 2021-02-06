import { SecureContextOptions } from 'tls'
import { createConnection, FieldInfo } from 'mysql'
import {
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common'
import * as _ from 'lodash'
import {
  ClientInterface,
  ClientResource,
  QueryResult,
  QueryRow,
  TableDetail,
} from './client.interface'

export class MysqlClient implements ClientInterface {
  constructor(private readonly resource: ClientResource) {}

  connection = createConnection({
    user: this.resource.username,
    password: this.resource.password,
    host: this.resource.host,
    port: this.resource.port,
    database: this.resource.database,
    ssl: this.sslConfig,
  })

  private get sslConfig():
    | (SecureContextOptions & { rejectUnauthorized?: boolean })
    | undefined {
    if (this.resource.sslRequired) {
      if (this.resource.selfCertificate) {
        return {
          key: this.resource.clientKey,
          cert: this.resource.clientCertificate,
        }
      }

      return {
        rejectUnauthorized: true,
      }
    }

    return undefined
  }

  async testConnection() {
    try {
      await this.runQuery('SELECT NOW();')
      return true
    } catch (error) {
      return false
    }
  }

  async runQuery<T = QueryRow>(query: string): Promise<QueryResult<T>> {
    this.connection.connect()
    try {
      const start = Date.now()
      const { results, fieldInfo } = await this._queryPromisified(query)
      const timeToRunQuery = Date.now() - start
      return {
        rows: results,
        fields: fieldInfo.map(field => ({ name: field.name.toLowerCase() })),
        timeToRunQuery,
        numRows: results.length,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    } finally {
      this.connection.end()
    }
  }

  async _queryPromisified(
    query: string,
  ): Promise<{ results: any[]; fieldInfo: FieldInfo[] }> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results, fieldInfo) => {
        if (error) {
          reject(error)
        } else {
          resolve({ results: results.map(this._transformResult), fieldInfo })
        }
      })
    })
  }

  _transformResult(row: any) {
    const output = {}
    Object.keys(row).forEach(key => {
      output[key.toLowerCase()] = row[key]
    })
    return output
  }

  async getSchema(): Promise<TableDetail[]> {
    try {
      const query = `
        SELECT
          table_name,
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_schema = '${this.resource.database}';
      `
      const { rows } = await this.runQuery<{
        table_name: string
        column_name: string
        data_type: string
      }>(query)
      const schema: TableDetail[] = []

      const tableGroups = _.groupBy(rows, row => row.table_name)
      Object.keys(tableGroups).map(table => {
        const columns = tableGroups[table]
        schema.push({
          name: table,
          columns: columns.map(column => ({
            name: column.column_name,
            type: column.data_type,
          })),
        })
      })

      return schema
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async fetchTableSampleData(): Promise<QueryResult> {
    throw new NotImplementedException('Not Implemented')
  }
}
