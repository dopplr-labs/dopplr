import { create } from 'zustand'
import postgres from 'postgres'
import { TabState, createTabSlice } from './tabs'

export type Store = {
  commandPalleteVisible: boolean
  setCommandPalleteVisible: (visible: boolean) => void
  saveQueryVisible: boolean
  setSaveQueryVisible: (visible: boolean) => void

  /** Query which ran recently */
  currentQueryData: postgres.RowList<(postgres.Row & Iterable<postgres.Row>)[]> | null
  setCurrentQueryData: (data: postgres.RowList<(postgres.Row & Iterable<postgres.Row>)[]>) => void
} & TabState

export const useStore = create<Store>((set, ...args) => ({
  commandPalleteVisible: false,
  setCommandPalleteVisible: (visible) => {
    set({
      commandPalleteVisible: visible,
    })
  },
  saveQueryVisible: false,
  setSaveQueryVisible: (visible) => {
    set({ saveQueryVisible: visible })
  },
  currentQueryData: null,
  setCurrentQueryData: (data) => {
    set({ currentQueryData: data })
  },
  ...createTabSlice(set, ...args),
}))
