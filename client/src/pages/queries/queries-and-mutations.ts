import { History, QueryResult, SavedQuery } from 'types/query'
import { SchemaResult } from 'types/schema'
import client from 'utils/client'

export async function runQuery({
  resource,
  query,
}: {
  resource: number
  query: string
}) {
  const { data } = await client.post<{ success: boolean; data: QueryResult }>(
    '/queries/run',
    {
      resource,
      query,
    },
  )
  return data.data
}

export async function fetchSchema(id: number) {
  const { data } = await client.get<{
    success: boolean
    data: SchemaResult[]
  }>(`/resources/schema/${id}`)
  return data.data
}

export async function fetchHistories(key: string, page = 1) {
  const { data } = await client.get<{
    success: boolean
    data: {
      items: History[]
      meta: {
        hasMore: boolean
        totalItems: number
        currentPage: number
        nextPage: number
      }
    }
  }>(`/queries/history?page=${page}`)
  return data.data
}

export async function fetchSampleData(resourceId: number, tableName: string) {
  const { data } = await client.get<{ success: boolean; data: QueryResult }>(
    `/resources/sample-data?resource=${resourceId}&tableName=${tableName}`,
  )
  return data.data
}

export async function deleteQuery(id: number) {
  const { data } = await client.delete(`/queries/${id}`)
  return data.data
}

export async function clearHistoryQuery() {
  const { data } = await client.delete<{
    success: boolean
    data: boolean
    message: string
  }>('/queries/history')
  return data
}

export async function fetchSavedQueries(key: string, page = 1) {
  const { data } = await client.get<{
    success: boolean
    data: {
      items: SavedQuery[]
      meta: {
        hasMore: boolean
        totalItems: number
        currentPage: number
        nextPage: number
      }
    }
  }>(`/queries/saved?page=${page}`)
  return data.data
}

export async function saveQuery({
  resourceId,
  query,
  name,
}: {
  resourceId: number
  query: string
  name: string
}) {
  const { data } = await client.post('/queries/save', {
    resource: resourceId,
    query,
    name,
  })
  return data.data
}

export async function fetchHistory(queryId: number) {
  const { data } = await client.get<{ data: History }>(`/queries/${queryId}`)
  return data.data
}

export async function fetchSavedQuery(queryId: number) {
  const { data } = await client.get<{ data: SavedQuery }>(`/queries/${queryId}`)
  return data.data
}

export async function updateQuery({
  queryId,
  name,
  query,
  resource,
}: {
  queryId: number
  name?: string
  query?: string
  resource?: number
}) {
  const updateQueryData: {
    name?: string
    query?: string
    resource?: number
  } = {}

  if (typeof name !== 'undefined') {
    updateQueryData.name = name
  }

  if (typeof query !== 'undefined') {
    updateQueryData.query = query
  }

  if (typeof resource !== 'undefined') {
    updateQueryData.resource = resource
  }

  const { data } = await client.patch<{ data: SavedQuery }>(
    `/queries/${queryId}`,
    updateQueryData,
  )

  return data.data
}
