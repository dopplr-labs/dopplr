import { Resource } from './resource'

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

export type History = {
  id: number
  createdAt: string
  updatedAt: string
  query: string
  resource: Resource
}

export type SavedQuery = History & {
  name: string
}

export type SavedQueryPage = {
  items: SavedQuery[]
  meta: {
    hasMore: boolean
    totalItems: number
    currentPage: number
    nextPage: number
  }
}
