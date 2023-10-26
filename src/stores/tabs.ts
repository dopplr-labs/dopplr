import { StateCreator } from 'zustand'
import { QueryResult, QueryTabData, TabDataStatus } from '@/types/tab'
import { arrayMove, generateRandomId, getNextActiveId } from '@/lib/utils'

export type TabState = {
  queryTabsOrder: string[]
  activeQueryTabId?: string
  setActiveQueryTabId: (tabId: string) => void
  addQueryTab: (tabId: string, resourceId: number, initialQuery?: string, name?: string, savedQueryId?: number) => void
  closeQueryTab: (tabId: string) => void
  updateQueryTabsOrder: (fromIndex: number, toIndex: number) => void
  updateQueryTabData: (id: string, data: Partial<QueryTabData>) => void
  duplicateQueryTab: (id: string) => void
  getTabData: (tabId: string) => QueryTabData

  /** Query tab data */
  queryTabName: Record<string, string>
  queryTabStatus: Record<string, TabDataStatus>
  queryTabQuery: Record<string, string>
  queryTabResource: Record<string, number>
  queryTabSavedQuery: Record<string, number>
  queryTabResult: Record<string, QueryResult>
}

export const createTabSlice: StateCreator<TabState> = (set, get) => ({
  queryTabsOrder: [],
  activeQueryTabId: undefined,
  queryTabName: {},
  queryTabStatus: {},
  queryTabQuery: {},
  queryTabResource: {},
  queryTabSavedQuery: {},
  queryTabResult: {},
  setActiveQueryTabId: (tabId) => {
    set({
      activeQueryTabId: tabId,
    })
  },
  addQueryTab: (tabId, resourceId, initialQuery = '', name = '', savedQueryId) => {
    set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, tabId],
      activeQueryTabId: tabId,
      queryTabName: {
        ...state.queryTabName,
        [tabId]: name,
      },
      queryTabQuery: {
        ...state.queryTabQuery,
        [tabId]: initialQuery,
      },
      queryTabResource: {
        ...state.queryTabResource,
        [tabId]: resourceId,
      },
      queryTabSavedQuery: savedQueryId
        ? {
            ...state.queryTabSavedQuery,
            [tabId]: savedQueryId,
          }
        : state.queryTabSavedQuery,
    }))
  },
  closeQueryTab: (tabId) => {
    set((state) => {
      const activeQueryTabId = getNextActiveId(state.queryTabsOrder, tabId)
      return {
        queryTabsOrder: state.queryTabsOrder.filter((id) => id !== tabId),
        activeQueryTabId,
      }
    })
  },
  updateQueryTabsOrder(fromIndex, toIndex) {
    set((state) => {
      return {
        queryTabsOrder: arrayMove(state.queryTabsOrder, fromIndex, toIndex),
      }
    })
  },
  updateQueryTabData: (id, data) => {
    if (data.name) {
      set((state) => ({ queryTabName: { ...state.queryTabName, [id]: data.name! } }))
    }

    if (data.dataStatus) {
      set((state) => ({ queryTabStatus: { ...state.queryTabStatus, [id]: data.dataStatus! } }))
    }

    if (data.query) {
      set((state) => ({ queryTabQuery: { ...state.queryTabQuery, [id]: data.query! } }))
    }

    if (data.resourceId) {
      set((state) => ({ queryTabResource: { ...state.queryTabResource, [id]: data.resourceId! } }))
    }

    if (data.savedQueryId) {
      set((state) => ({ queryTabSavedQuery: { ...state.queryTabSavedQuery, [id]: data.savedQueryId! } }))
    }

    if (data.queryResult) {
      set((state) => ({ queryTabResult: { ...state.queryTabResult, [id]: data.queryResult! } }))
    }
  },
  duplicateQueryTab: (id) => {
    const newId = generateRandomId(16)
    const name = get().queryTabName[id]
    const query = get().queryTabQuery[id]
    const resource = get().queryTabResource[id]
    const savedQueryId = get().queryTabSavedQuery[id]
    const queryResult = get().queryTabResult[id]

    return set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, newId],
      activeQueryTabId: newId,
      queryTabName: {
        ...state.queryTabName,
        [newId]: name,
      },
      queryTabQuery: {
        ...state.queryTabQuery,
        [newId]: query,
      },
      queryTabResource: {
        ...state.queryTabResource,
        [newId]: resource,
      },
      queryTabSavedQuery: {
        ...state.queryTabSavedQuery,
        [newId]: savedQueryId,
      },
      queryTabResult: { ...state.queryTabResult, [newId]: queryResult },
    }))
  },
  getTabData: (tabId) => {
    return {
      tabId,
      resourceId: get().queryTabResource[tabId],
      query: get().queryTabQuery[tabId],
      savedQueryId: get().queryTabSavedQuery[tabId],
      name: get().queryTabName[tabId],
      dataStatus: get().queryTabStatus[tabId],
      queryResult: get().queryTabResult[tabId],
    }
  },
})
