export type QueryField = {
  name: string
  tableId: number
  columnId: number
  dataTypeId: number
  dataTypeSize: number
  dataTypeModifier: number
  format: string
}

export type Query = {
  rows: any[]
  fields: QueryField[]
  rowCount: number
}
