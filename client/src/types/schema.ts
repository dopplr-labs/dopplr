export type ColumnsField = {
  name: string
  type: string
}

export type SchemaResult = {
  name: string
  rowsCount: string
  columns: ColumnsField[]
}
