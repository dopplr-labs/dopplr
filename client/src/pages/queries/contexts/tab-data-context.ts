import React, { createContext } from 'react'
import { TabData } from '../types'

const TabDataContext = createContext<{
  tabData: Record<string, TabData>
  setTabData: React.Dispatch<React.SetStateAction<Record<string, TabData>>>
}>({
  tabData: {},
  setTabData: () => {},
})

export default TabDataContext
