import React, { useCallback, useEffect, useState } from 'react'
import * as uuid from 'uuid'
import { QueryResult } from 'types/query'
import { noop } from 'utils/noop'
import { filter, matches, negate } from 'lodash-es'
import { useParams, useNavigate } from 'react-router-dom'
import { queryCache } from 'react-query'
import {
  fetchHistory,
  fetchSavedQuery,
} from 'pages/queries/queries-and-mutations'

export enum TabType {
  NEW = 'new',
  HISTORY = 'history',
  SAVED = 'saved',
}

type ID = number | string

export type TabData = {
  name: string
  resource?: ID
  query: string
  queryResult?: QueryResult
}

export type Tab = {
  id: string
  type: TabType
  isLoading: boolean
  data?: TabData
  error?: Error
}

export type TabQuery = {
  resource?: ID
}

export const TabsContext = React.createContext<{
  activeTabId?: string
  tabs: Tab[]
  openTab: (tabType: TabType, id?: ID) => void
  closeTab: (tabType: TabType, id?: ID) => void
  closeTabsWhere: (query: TabQuery) => void
  updateTab: (
    tabId: string,
    updatedData: {
      isLoading?: boolean
      data?: Partial<TabData>
      error?: Error
    },
  ) => void
  focusTab: (tabType: TabType, id: ID) => void
}>({
  tabs: [],
  openTab: noop,
  closeTab: noop,
  closeTabsWhere: noop,
  updateTab: noop,
  focusTab: noop,
})

/**
 * The TabsProvider component is conceived as an independent tab management system
 * without the intervention of nagation.
 *
 * @TODO Update TabProvider component documentation
 */
export function TabProvider({ children }: { children: React.ReactElement }) {
  const [tabs, setTabs] = useState<Tab[]>([])

  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined)

  /**
   * Function to update a particular tab
   *
   * @param tabId - id of the tab to be updated
   * @param updatedData - object containing updated states like (isLoading, data, error)
   */
  const updateTab = useCallback(
    (
      tabId: string,
      updatedData: {
        isLoading?: boolean
        data?: Partial<TabData>
        error?: Error
      },
    ) => {
      setTabs((prevTabs) => {
        return prevTabs.map((tab) => {
          if (tab.id === tabId) {
            const { isLoading, data, error } = updatedData
            const tabData = { ...tab }
            if (typeof isLoading !== 'undefined') {
              tabData.isLoading = isLoading
            }
            if (typeof data !== 'undefined') {
              tabData.data = { ...tabData.data, ...data } as TabData
            }
            if (typeof error !== 'undefined') {
              tabData.error = error
            }
            return tabData
          }
          return tab
        })
      })
    },
    [],
  )

  /**
   * Function to open the tab. It can be used to create a new tab or open an
   * entity (history / saved query) in the tab
   *
   * @param tabType - the type of the tab to be opened
   * @param id - id of the tab (generally it would be related to the entity rendered)
   *
   * @example
   * // opens a new tab
   * openTab(TabType.NEW)
   *
   * @example
   * // opens a history query (id: 2) in a tab
   * openTab(TabType.HISTORY, 2)
   */
  const openTab = useCallback(
    (tabType: TabType, id?: ID) => {
      const newTabId = tabType === TabType.NEW ? uuid.v4() : `${tabType}-${id}`
      const newTab: Tab = { type: tabType, id: newTabId, isLoading: true }
      setTabs((prevTabs) => [...prevTabs, newTab])
      resolveTabData(tabType, id)
        .then((data) => {
          updateTab(newTabId, { isLoading: false, data })
        })
        .catch((error) => {
          updateTab(newTabId, { isLoading: false, error })
        })
    },
    [updateTab],
  )

  /**
   * Close a particular tab
   *
   * @param tabType - the type of the tab to be closed
   * @param id - id of the tab to be closed
   */
  const closeTab = useCallback((tabType: TabType, id?: ID) => {
    const tabId = id ? `${tabType}-${id}` : undefined
    setTabs((prevTabs) => {
      return prevTabs.filter((tab) => {
        return (
          tab.type === tabType &&
          // if id is provided then check if the tab.id is same as id or not
          // else just return true, so that the only comparision would of tab type
          (typeof tabId !== 'undefined' ? tab.id === tabId : true)
        )
      })
    })
  }, [])

  /**
   * Close all the tabs with the matching query
   *
   * @param tabQuery - the query used to select the tabs based on this state
   *
   * @example
   * // would close all the tabs for having resource 2
   * closeTabsWhere({ resource: 2 })
   */
  const closeTabsWhere = useCallback((tabQuery: TabQuery) => {
    setTabs((prevTabs) => {
      return filter(prevTabs, negate(matches({ data: tabQuery })))
    })
  }, [])

  /**
   * Focus the particular tab
   *
   * @param tabType - type of the tab to be closed
   * @param id - id of the tab to be closed
   */
  const focusTab = useCallback((tabType: TabType, id: ID) => {
    setActiveTabId(`${tabType}-${id}`)
  }, [])

  const { tabType, tabId } = useParams() as { tabType: TabType; tabId: string }
  useEffect(
    /**
     * Set the active tab based on the route as soon as component mounts. It
     * helps us to set the active tab based on the route for the first time.
     */
    function setActiveTabOnComponentMount() {
      if (tabType !== TabType.NEW) {
        openTab(tabType, tabId)
      } else {
        openTab(tabType)
      }
    },
    // not passing any arguments in the dependency array, because we want to only run this
    // effect when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const navigate = useNavigate()
  useEffect(
    function updateRouteBasedOnActiveTab() {
      if (activeTabId) {
        // activeTabId is in the form tabType-tabId (saved-1 / history-2 / new-de0cd139-ea68-43aa-a6ce-698bb640f9cd)
        const [tabType, ...rest] = activeTabId.split('-')
        const tabId = rest.join('-')
        navigate(`/queries/${tabType}/${tabId}`)
      }
    },
    [activeTabId, navigate],
  )

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        closeTabsWhere,
        updateTab,
        focusTab,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export async function resolveTabData(
  tabType: TabType,
  id?: ID,
): Promise<TabData> {
  switch (tabType) {
    case TabType.NEW: {
      return resolveDataForNewTab()
    }

    case TabType.HISTORY: {
      if (!id) {
        throw new Error('cannot fetch history data without any id')
      }
      return resolveDataForHistoryTab(id)
    }

    case TabType.SAVED: {
      if (!id) {
        throw new Error('cannot fetch saved query data without any id')
      }
      return resolveDataForSavedTab(id)
    }

    default: {
      throw new Error('')
    }
  }
}

async function resolveDataForNewTab(): Promise<TabData> {
  return {
    name: 'Untitled Query',
    query: '',
  }
}

async function resolveDataForHistoryTab(id: ID): Promise<TabData> {
  const data = await queryCache.fetchQuery(['history', id], () =>
    fetchHistory(id as number),
  )

  if (!data) {
    throw new Error(`data not found for history with id - ${id}`)
  }

  return {
    name: 'Untitled Query',
    query: data.query,
    resource: data.resource.id,
  }
}

async function resolveDataForSavedTab(id: ID): Promise<TabData> {
  const data = await queryCache.fetchQuery(['saved-query', id], () =>
    fetchSavedQuery(id as number),
  )

  if (!data) {
    throw new Error(`data not found for saved query with id - ${id}`)
  }

  return {
    name: data.name,
    query: data.query,
    resource: data.resource.id,
  }
}
