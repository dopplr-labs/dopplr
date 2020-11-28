import { QueryResult, History, SavedQuery } from './query'
import { Resource } from './resource'

export enum TabType {
  UNSAVED = 'UNSAVED',
  HISTORY = 'HISTORY',
  SAVED_QUERY = 'SAVED_QUERY',
}

export type UnsavedTabData = {
  query: string
  resource?: Resource
  queryResult?: QueryResult
}

export type UnsavedTab = {
  id: string
  type: TabType.UNSAVED
  data: UnsavedTabData
}

export type HistoryTabData = History & {
  queryResult?: QueryResult
}

export type HistoryTab = {
  id: string
  type: TabType.HISTORY
  data: HistoryTabData
}

export type SavedQueryTabData = SavedQuery & {
  queryResult?: QueryResult
}

export type SavedQueryTab = {
  id: string
  type: TabType.SAVED_QUERY
  data: SavedQueryTabData
}

export type Tab = UnsavedTab | HistoryTab | SavedQueryTab
