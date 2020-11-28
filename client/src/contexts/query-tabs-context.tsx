import { createContext } from 'react'
import {
  HistoryTabData,
  SavedQueryTabData,
  Tab,
  TabType,
  UnsavedTabData,
} from 'types/tab'

export type OpenInTabOptions =
  | { type: TabType.HISTORY; data: HistoryTabData }
  | { type: TabType.SAVED_QUERY; data: SavedQueryTabData }

export type UpdateTabOptions =
  | {
      id: string
      name?: string
      type: TabType.UNSAVED
      data: Partial<UnsavedTabData>
    }
  | {
      id: string
      name?: string
      type: TabType.HISTORY
      data: Partial<HistoryTabData>
    }
  | {
      id: string
      name?: string
      type: TabType.SAVED_QUERY
      data: Partial<SavedQueryTabData>
    }

type QueryTabsContextProps = {
  tabs: Tab[]
  activeTabId?: string
  createNewTab: () => void
  openInTab: (options: OpenInTabOptions) => void
  closeTab: (tabId: string) => void
  updateTab: (option: UpdateTabOptions) => void
  focusTab: (tabId: string) => void
}

export const QueryTabsContext = createContext<QueryTabsContextProps>({
  tabs: [],
  createNewTab: () => {},
  openInTab: () => {},
  closeTab: () => {},
  updateTab: () => {},
  focusTab: () => {},
})
