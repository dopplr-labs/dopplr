import { History } from './history'
import { Resource } from './resource'

export type QueryField = {
  name: string
}

export type QueryResult = {
  rows: any[]
  timeToRunQuery: number
  fields: QueryField[]
  numRows: number
  maxLimitEnforced?: boolean
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

export type Query = {
  id: number
  isSaved: boolean
  name: string
  query: string
  resource: Resource
}
