import { createContext } from 'react'

export const TabsContext = createContext<{
  updateTab: (updateTabProps: {
    tabRoute: string
    name?: string
    unsavedState?: boolean
    newRoute?: string
  }) => void
}>({
  updateTab: () => {},
})
