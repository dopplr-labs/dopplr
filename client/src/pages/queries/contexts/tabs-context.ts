import { createContext } from 'react'

const TabsContext = createContext<{
  tabs: string[]
  removeTab: (tabRoute: string) => void
  updateTabRoute: (fromTabRoute: string, toTabRoute: string) => void
}>({
  tabs: [],
  removeTab: () => {},
  updateTabRoute: () => {},
})

export default TabsContext
