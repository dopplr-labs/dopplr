import { StateCreator } from 'zustand'
import { QueryTabData, TabDataStatus } from '@/types/tab'
import { arrayMove, generateRandomId, getNextActiveId } from '@/lib/utils'

export type TabState = {
  queryTabsOrder: string[]
  activeQueryTabId?: string
  setActiveQueryTabId: (tabId: string) => void
  queryTabData: Record<string, Omit<QueryTabData, 'id'>>
  addQueryTab: (tabId: string, resourceId: number, initialQuery?: string) => void
  closeQueryTab: (tabId: string) => void
  updateQueryTabsOrder: (fromIndex: number, toIndex: number) => void
  updateQueryTabData: (id: string, data: Partial<QueryTabData>) => void
  duplicateQueryTab: (id: string) => void
}

export const createTabSlice: StateCreator<TabState> = (set, get) => ({
  queryTabsOrder: [],
  acitveQueryTabId: undefined,
  queryTabData: {},
  setActiveQueryTabId: (tabId) => {
    set({
      activeQueryTabId: tabId,
    })
  },
  addQueryTab: (tabId, resourceId, initialQuery = '') => {
    set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, tabId],
      queryTabData: {
        ...state.queryTabData,
        [tabId]: {
          tabId,
          resourceId,
          query: initialQuery,
          dataStatus: TabDataStatus.SAVED,
        },
      },
      activeQueryTabId: tabId,
    }))
  },
  closeQueryTab: (tabId) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [tabId]: _, ...queryTabData } = state.queryTabData
      const activeQueryTabId = getNextActiveId(state.queryTabsOrder, tabId)
      return {
        queryTabsOrder: state.queryTabsOrder.filter((id) => id !== tabId),
        queryTabData,
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
    set((state) => ({
      queryTabData: {
        ...state.queryTabData,
        [id]: {
          ...state.queryTabData[id],
          ...data,
        },
      },
    }))
  },
  duplicateQueryTab: (id) => {
    const newId = generateRandomId(16)
    const tabData = get().queryTabData[id]
    return set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, newId],
      queryTabData: {
        ...state.queryTabData,
        [newId]: {
          ...tabData,
          tabId: newId,
        },
      },
      activeQueryTabId: newId,
    }))
  },
})
