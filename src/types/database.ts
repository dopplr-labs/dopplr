export type Schema = {
  name: string
}

type Column = {
  attisdropped: boolean
  attname: string
  attnum: number
  attrelid: string
  data_type: string
}

export type TableColumn = {
  schemaname: string
  tablename: string
  quoted_name: string
  is_table: boolean
  columns: Column[]
}

export type DatabaseFunction = {
  schema: string
  name: string
  description: string
  result_type: any
  argument_types: any
  args?: string[]
}

export type DatabaseKeyword = {
  word: string
}
