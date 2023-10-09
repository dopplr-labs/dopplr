import { create } from 'zustand'
import { TabState, createTabSlice } from './tabs'

export type Store = {
  commandPalleteVisible: boolean
  setCommandPalleteVisible: (visible: boolean) => void
  saveQueryVisible: boolean
  setSaveQueryVisible: (visible: boolean) => void
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
  ...createTabSlice(set, ...args),
}))
