export type Schema = {
  name: string
}

type Column = {
  attname: string
  attnum: number
  data_type: string
}

export type TableColumn = {
  schemaname: string
  tablename: string
  quoted_name: string
  is_table: boolean | (1 | 0)
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
