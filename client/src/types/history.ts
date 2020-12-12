export type History = {
  id: number
  createdAt: string
  query: string
  resource: {
    id: number
  }
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
