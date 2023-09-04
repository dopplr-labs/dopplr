export type Schema = {
  name: string
}

export type TableColumn = {
  schemaname: string
  tablename: string
  quoted_name: string
  is_table: boolean
  columns: any[]
}

export type DatabaseFunction = {
  schema: string
  name: string
  description: string
  result_type: any
  argument_types: any
  args?: string[]
}
