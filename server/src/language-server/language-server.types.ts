import { CompletionItem } from 'vscode-languageserver'

export interface IConnection {
  label: string
  readonly host: string
  readonly user: string
  password?: string
  hasPassword?: boolean
  readonly port: number
  readonly database?: string
  multipleStatements?: boolean
  readonly certPath?: string
  ssl?: any
}

export interface ISetConnection {
  connection: IConnection
  documentUri: string
}

export interface ExplainResults {
  rowCount: number
  command: string
  rows?: any[]
  fields?: any[]
}

export interface DBSchema {
  name: string
}

export interface DBField {
  attisdropped: boolean
  attname: string
  attnum: number
  attrelid: string
  datatype: string
  tablesize: number
}

export interface DBTable {
  schemaname: string
  tablename: string
  isTable: boolean
  tablesize: number
  columns: DBField[]
}

export interface DBFunctionsRaw {
  schema: string
  name: string
  resultType: string
  argumentTypes: string
  type: string
  description: string
}

export interface DBFunctionArgList {
  args: string[]
  description: string
}

export interface DBFunction {
  schema: string
  name: string
  resultType: string
  overloads: DBFunctionArgList[]
  type: string
}

export interface Ident {
  isQuoted: boolean
  name: string
}

export interface FieldCompletionItem extends CompletionItem {
  tables?: string[]
}
