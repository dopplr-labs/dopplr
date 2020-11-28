import React, { useCallback, useEffect, useReducer } from 'react'
import {
  QueryTabsContext,
  OpenInTabOptions,
  UpdateTabOptions,
} from 'contexts/query-tabs-context'
import { ActionTypes, reducer } from './reducer'

type QueryTabsProps = {
  children: React.ReactNode
}

export default function QueryTabs({ children }: QueryTabsProps) {
  const [state, dispatch] = useReducer(reducer, { tabs: [] })

  const createNewTab = useCallback(() => {
    dispatch({ type: ActionTypes.CREATE_NEW_TAB })
  }, [])

  const openInTab = useCallback((options: OpenInTabOptions) => {
    dispatch({ type: ActionTypes.OPEN_IN_TAB, payload: options })
  }, [])

  const updateTab = useCallback((options: UpdateTabOptions) => {
    dispatch({ type: ActionTypes.UPDATE_TAB, payload: options })
  }, [])

  const closeTab = useCallback((tabId: string) => {
    dispatch({ type: ActionTypes.CLOSE_TAB, payload: { tabId } })
  }, [])

  const focusTab = useCallback((tabId: string) => {
    dispatch({ type: ActionTypes.FOCUS_TAB, payload: { tabId } })
  }, [])

  useEffect(() => {
    if (state.tabs.length === 0) {
      createNewTab()
    }
  }, [state.tabs.length, createNewTab])

  return (
    <QueryTabsContext.Provider
      value={{
        ...state,
        createNewTab,
        openInTab,
        closeTab,
        updateTab,
        focusTab,
      }}
    >
      {children}
    </QueryTabsContext.Provider>
  )
}
