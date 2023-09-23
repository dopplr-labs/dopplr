import { create } from 'zustand'
import { QueryTabData } from '@/types/tab'
import { arrayMove } from '@/lib/utils'

export type Store = {
  queryTabsOrder: string[]
  queryTabData: Record<string, Omit<QueryTabData, 'id'>>

  addQueryTab: (tabId: string, resourceId: string) => void
  closeQueryTab: (tabId: string) => void
  updateQueryTabOrder: (fromIndex: number, toIndex: number) => void
  updateQueryData: (id: string, data: Partial<QueryTabData>) => void
}

export const useStore = create<Store>((set) => ({
  queryTabsOrder: [],
  queryTabData: {},

  addQueryTab: (tabId, resourceId) => {
    set((state) => ({
      queryTabsOrder: [...state.queryTabsOrder, tabId],
      queryTabData: {
        ...state.queryTabData,
        [tabId]: {
          tabId,
          resourceId,
          query: '',
        },
      },
    }))
  },
  closeQueryTab: (tabId) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [tabId]: _, ...queryTabData } = state.queryTabData
      return {
        queryTabsOrder: state.queryTabsOrder.filter((id) => id !== tabId),
        queryTabData,
      }
    })
  },
  updateQueryTabOrder(fromIndex, toIndex) {
    set((state) => {
      return {
        queryTabsOrder: arrayMove(state.queryTabsOrder, fromIndex, toIndex),
      }
    })
  },
  updateQueryData: (id, data) => {
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
