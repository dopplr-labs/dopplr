import { create } from 'zustand'
import { QueryTabData, TabDataStatus } from '@/types/tab'
import { arrayMove, getNextActiveId } from '@/lib/utils'

export type Store = {
  queryTabsOrder: string[]
  activeQueryTabId?: string
  setActiveQueryTabId: (tabId: string) => void
  queryTabData: Record<string, Omit<QueryTabData, 'id'>>
  addQueryTab: (tabId: string, resourceId: number) => void
  closeQueryTab: (tabId: string) => void
  updateQueryTabsOrder: (fromIndex: number, toIndex: number) => void
  updateQueryTabData: (id: string, data: Partial<QueryTabData>) => void
}

export const useStore = create<Store>((set) => ({
  queryTabsOrder: [],
  acitveQueryTabId: undefined,
  queryTabData: {},
  setActiveQueryTabId: (tabId) => {
    set({
      activeQueryTabId: tabId,
    })
  },
  addQueryTab: (tabId, resourceId) => {
    set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, tabId],
      queryTabData: {
        ...state.queryTabData,
        [tabId]: {
          tabId,
          resourceId,
          query: '',
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
}))
