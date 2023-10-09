export enum TabDataStatus {
  SAVED = 'SAVED',
  UNSAVED = 'UNSAVED',
}

export type QueryTabData = {
  tabId: string
  resourceId: number
  /** the query string present in the editor */
  query: string
  savedQueryId?: number
  /** name of the saved query */
  name?: string
  dataStatus: TabDataStatus
  queryResult?: QueryResult
}

// TODO: Figure out if there any way to get the type of the query result
export type QueryResult = Record<string, unknown>[]
