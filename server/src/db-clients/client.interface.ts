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
}

export type ColumnDetail = {
  name: string
  type: string
}

export type TableDetail = {
  name: string
  columns: ColumnDetail[]
}

export type ClientResource = {
  type: string
  host: string
  port: number
  database: string
  username: string
  password: string
}

export interface ClientInterface {
  testConnection: () => Promise<boolean>
  runQuery: <T = QueryRow>(query: string) => Promise<QueryResult<T>>
  getSchema: () => Promise<TableDetail[]>
  fetchTableSampleData: (tableName: string) => Promise<QueryResult>
}
