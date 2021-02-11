import { Resource } from 'src/resources/resource.entity'

export type QueryRow = {
  [column: string]: string
}

export type QueryField = {
  name: string
}

export type QueryResult<T = QueryRow> = {
  rows: T[]
  fields: QueryField[]
  timeToRunQuery: number
  numRows: number
  maxLimitEnforced?: boolean
}

export type ColumnDetail = {
  name: string
  type: string
}

export type TableDetail = {
  name: string
  columns: ColumnDetail[]
}

export enum ClientType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}

export type ClientResource = Partial<Resource>
export interface ClientInterface {
  testConnection: () => Promise<boolean>
  runQuery: <T = QueryRow>(query: string) => Promise<QueryResult<T>>
  getSchema: () => Promise<TableDetail[]>
  fetchTableSampleData: (tableName: string) => Promise<QueryResult>
}
