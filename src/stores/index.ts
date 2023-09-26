import { create } from 'zustand'
import { TabState, createTabSlice } from './tabs'

export type Store = {
  commandPalleteVisible: boolean
  setCommandPalleteVisible: (visible: boolean) => void
} & TabState

export const useStore = create<Store>((set, ...args) => ({
  commandPalleteVisible: false,
  setCommandPalleteVisible: (visible) => {
    set({
      commandPalleteVisible: visible,
    })
  },
  ...createTabSlice(set, ...args),
}))
