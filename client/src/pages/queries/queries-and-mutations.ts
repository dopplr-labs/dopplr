import { QueryResult, SavedQuery, SavedQueryPage } from 'types/query'
import { History, HistoryPage } from 'types/history'
import client from 'utils/client'
import { truncate } from 'lodash-es'
import { fetchResources } from 'pages/resources/queries'
import { QueryClient } from 'react-query'
import { TabData, TabType } from './types'

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

export async function fetchHistories(page = 1) {
  const { data } = await client.get<{
    success: boolean
    data: HistoryPage
  }>(`/queries/history?page=${page}`)
  return data.data
}

export async function fetchHistory(queryId: number) {
  const { data } = await client.get<{ data: History }>(`/queries/${queryId}`)
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

export async function fetchSavedQueries(page = 1) {
  const { data } = await client.get<{
    success: boolean
    data: SavedQueryPage
  }>(`/queries/saved?page=${page}`)
  return data.data
}

export async function fetchSavedQuery(queryId: number) {
  const { data } = await client.get<{ data: SavedQuery }>(`/queries/${queryId}`)
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

export default async function fetchTabData(
  queryClient: QueryClient,
  tabRoute: string,
): Promise<TabData> {
  const [tabType, tabId] = tabRoute.split('/')

  switch (tabType) {
    case TabType.NEW: {
      return fetchNewTabData(queryClient)
    }

    case TabType.HISTORY: {
      const id = Number.parseInt(tabId)
      if (typeof id !== 'number') {
        throw new Error('Invalid history id')
      }
      return fetchHistoryTabData(queryClient, id)
    }

    case TabType.SAVED: {
      const id = Number.parseInt(tabId)
      if (typeof id !== 'number') {
        throw new Error('Invalid saved query id')
      }
      return fetchSavedTabData(queryClient, id)
    }

    default: {
      throw new Error('Invalid tab type')
    }
  }
}

async function fetchNewTabData(queryClient: QueryClient): Promise<TabData> {
  const resources = await queryClient.fetchQuery(['resources'], () =>
    fetchResources(),
  )
  return {
    resourceId: resources?.[0]?.id,
    name: 'Untitled Query',
    query: '',
  }
}

async function fetchHistoryTabData(
  queryClient: QueryClient,
  id: number,
): Promise<TabData> {
  const history = await queryClient.fetchQuery(['history', id], () =>
    fetchHistory(id),
  )
  return {
    resourceId: history.resource?.id,
    name: truncate(history.query, { length: 20 }),
    query: history.query,
  }
}

async function fetchSavedTabData(
  queryClient: QueryClient,
  id: number,
): Promise<TabData> {
  const savedQuery = await queryClient.fetchQuery(['saved-query', id], () =>
    fetchSavedQuery(id),
  )
  return {
    resourceId: savedQuery.resource?.id,
    name: savedQuery.name,
    query: savedQuery.query,
  }
}
