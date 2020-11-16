export type SchemaResult = {
  table: string
  columns: ColumnsField[]
}

export type ColumnsField = {
  column_name: string
  data_type: string
}
