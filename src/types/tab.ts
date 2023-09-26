export enum TabDataStatus {
  SAVED = 'SAVED',
  UNSAVED = 'UNSAVED',
}

export type QueryTabData = {
  tabId: string
  savedQueryId?: number
  resourceId: number
  /** the query string present in the editor */
  query: string
  /** name of the saved query */
  name?: string
  dataStatus: TabDataStatus
}
