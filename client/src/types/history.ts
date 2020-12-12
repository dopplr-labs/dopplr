import { Resource } from './resource'

export type History = {
  id: number
  createdAt: string
  updatedAt: string
  query: string
  resource: Resource
}

export type HistoryPage = {
  items: History[]
  meta: {
    hasMore: boolean
    totalItems: number
    currentPage: number
    nextPage: number
  }
}
