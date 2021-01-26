import React, { createContext } from 'react'
import { TabData } from '../types'

const TabsDataContext = createContext<{
  tabsData: Record<string, TabData>
  setTabsData: React.Dispatch<React.SetStateAction<Record<string, TabData>>>
}>({
  tabsData: {},
  setTabsData: () => {},
})

export default TabsDataContext
