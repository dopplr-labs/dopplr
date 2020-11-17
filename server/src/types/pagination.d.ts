export type PaginationMetaData = {
  hasMore: boolean
  totalItems: number
  currentPage: number
  nextPage: number
}

export interface PaginationData<DataType> {
  items: DataType[]
  meta: PaginationMetaData
}
