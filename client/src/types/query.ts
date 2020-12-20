import { History } from './history'

export type QueryField = {
  name: string
}

export type QueryResult = {
  rows: any[]
  timeToRunQuery: number
  fields: QueryField[]
  rowCount: number
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
