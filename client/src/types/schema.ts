export type SchemaResult = {
  table: string
  columns: ColumnsField[]
}

export type ColumnsField = {
  // eslint-disable-next-line camelcase
  column_name: string
  // eslint-disable-next-line camelcase
  data_type: string
}
