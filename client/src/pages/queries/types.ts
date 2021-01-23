export enum TabType {
  NEW = 'new',
  HISTORY = 'history',
  SAVED = 'saved',
}

export type TabData = {
  resourceId?: number
  name: string
  query: string
}
