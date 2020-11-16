export type QueryField = {
  name: string
  tableId: number
  columnId: number
  dataTypeId: number
  dataTypeSize: number
  dataTypeModifier: number
  format: string
}

export type QueryResult = {
  rows: any[]
  fields: QueryField[]
  rowCount: number
}
