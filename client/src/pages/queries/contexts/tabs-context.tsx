import { createContext } from 'react'

export const TabsContext = createContext<{
  updateTabName: (tabRoute: string, name: string) => void
  updateTabUnsavedState: (tabRoute: string, unsavedState: boolean) => void
}>({
  updateTabName: () => {},
  updateTabUnsavedState: () => {},
})
