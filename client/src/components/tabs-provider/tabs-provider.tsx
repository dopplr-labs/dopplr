import React, { createContext } from 'react'
import { QueryResult } from 'types/query'
import * as uuid from 'uuid'
import { noop } from 'utils/noop'
import { NavigateFunction, withNavigate, withRouteParams } from 'utils/router'
import { queryCache } from 'react-query'
import { fetchResources } from 'pages/resources/queries'
import {
  fetchHistory,
  fetchSavedQuery,
} from 'pages/queries/queries-and-mutations'
import { filter, matches, merge, negate } from 'lodash-es'

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
  hasUnsavedChange: boolean
}

export type TabQuery = {
  resource?: ID
}

export const TabsContext = createContext<{
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
      hasUnsavedChanges?: boolean
    },
  ) => void
  focusTab: (tabId: string) => void
}>({
  tabs: [],
  openTab: noop,
  closeTab: noop,
  closeTabsWhere: noop,
  updateTab: noop,
  focusTab: noop,
})

type TabsProviderProps = {
  children: React.ReactElement
  params: Record<string, string>
  navigate: NavigateFunction
}

type TabsProviderState = {
  tabs: Tab[]
  activeTabId?: string
}

/**
 * TabsProvider component provides utilities to render tabs in queries page.
 */
class TabsProvider extends React.Component<
  TabsProviderProps,
  TabsProviderState
> {
  static LOCAL_STORAGE_KEY = 'query-tabs'

  static getInitialTabs(): Tab[] {
    try {
      return JSON.parse(
        window.localStorage.getItem(TabsProvider.LOCAL_STORAGE_KEY) ?? '[]',
      )
    } catch (error) {
      return []
    }
  }

  static getTabTypeAndIdFromTabId(tabId: string): [TabType, string] {
    const [tabType, ...rest] = tabId.split('-')
    return [tabType as TabType, rest.join('-')]
  }

  state = {
    tabs: TabsProvider.getInitialTabs(),
    activeTabId: undefined,
  } as TabsProviderState

  componentDidMount() {
    const { params = {} } = this.props
    const { tabType, id } = params
    const { tabs } = this.state

    // if the user opens /queries page, then there won't be any tabType or id
    if (!tabType) {
      // in that case, check if we already have some, then open the first tab
      if (tabs.length !== 0) {
        const [
          firstTabType,
          firstTabId,
        ] = TabsProvider.getTabTypeAndIdFromTabId(tabs[0].id)
        this.openTab(firstTabType, firstTabId)
      } else {
        // else open a new tab
        this.openTab(TabType.NEW)
      }
    } else if (tabType && id) {
      // if we have both tabType and id, then check if the tabType is one of 'new', 'saved', 'history'
      // then open the correct
      if (tabType in TabType) {
        this.openTab(tabType as TabType, id)
      } else {
        // else open a new tab
        this.openTab(TabType.NEW)
      }
    }
  }

  componentDidUpdate(
    prevProps: TabsProviderProps,
    prevState: TabsProviderState,
  ) {
    this.persistTabsStateToLocalStorage()

    if (this.state.activeTabId !== prevState.activeTabId) {
      this.updateRoute()
    }
  }

  /**
   * Persist the tabs state to local storage, so that it can be restored
   * when the component mounts
   */
  persistTabsStateToLocalStorage = () => {
    window.localStorage.setItem(
      TabsProvider.LOCAL_STORAGE_KEY,
      JSON.stringify(this.state.tabs),
    )
  }

  /**
   * Update the route based on the activeTabId.
   *
   * As the TabsProvider component handles the active tab state and other
   * tab information, we longer depend on `react-router-dom` to get the active tab.
   * So, we need to make sure that the route and activeTab remain in sync, so that
   * the URL could be shared.
   */
  updateRoute = () => {
    const { activeTabId } = this.state
    const { navigate } = this.props
    if (activeTabId) {
      const [tabType, id] = TabsProvider.getTabTypeAndIdFromTabId(activeTabId)
      navigate(`/queries/${tabType}/${id}`)
    } else {
      navigate('/queries')
    }
  }

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
  openTab = (tabType: TabType, id?: ID) => {
    const newTabId = `${tabType}-${id ?? uuid.v4()}`

    this.setState(
      (prevState) => {
        const { tabs: prevTabs } = prevState

        if (prevTabs.find((tab) => tab.id === newTabId)) {
          return {
            tabs: prevTabs,
            activeTabId: newTabId,
          }
        }

        const newTab: Tab = {
          type: tabType,
          id: newTabId,
          isLoading: true,
          hasUnsavedChange: false,
        }

        return {
          tabs: [...prevTabs, newTab],
          activeTabId: newTabId,
        }
      },
      () => {
        this.resolveTabData(newTabId)
      },
    )
  }

  /**
   * Function to update a particular tab
   *
   * @param tabId - id of the tab to be updated
   * @param updatedData - object containing updated states like (isLoading, data, error)
   */
  updateTab = (
    tabId: string,
    updatedData: {
      isLoading?: boolean
      data?: Partial<TabData>
      error?: Error
      hasUnsavedChanges?: boolean
    },
  ) => {
    this.setState(({ tabs: prevTabs }) => {
      return {
        tabs: prevTabs.map((tab) => {
          if (tab.id === tabId) {
            return merge({ ...tab }, updatedData)
          }
          return tab
        }),
      }
    })
  }

  /**
   * Close a particular tab
   *
   * @param tabType - the type of the tab to be closed
   * @param id - id of the tab to be closed
   */
  closeTab = (tabType: TabType, id?: ID) => {
    const tabId = id ? `${tabType}-${id}` : undefined
    this.setState((prevState) => {
      const { tabs: prevTabs } = prevState

      const closedTabIndex = prevTabs.findIndex(
        (tab) =>
          tab.type === tabType &&
          // if id is provided then check if the tab.id is same as id or not
          // else just return true, so that the only comparision would of tab type
          (typeof tabId !== 'undefined' ? tab.id === tabId : true),
      )

      if (closedTabIndex !== -1) {
        const newTabs = prevTabs.filter((_, index) => {
          return index !== closedTabIndex
        })
        const nextTabIndex =
          closedTabIndex === 0 ? prevTabs.length - 1 : closedTabIndex - 1
        const newActiveTabId =
          // if the closedTabIndex is same as nextTabIndex, then we can't set any activeTabId
          // it would remain same in some cases, where the closedTabIndex would be 0
          closedTabIndex !== nextTabIndex
            ? prevTabs[nextTabIndex].id
            : undefined
        return {
          tabs: newTabs,
          activeTabId: newActiveTabId,
        }
      }

      return prevState
    })
  }

  /**
   * Close all the tabs with the matching query
   *
   * @param tabQuery - the query used to select the tabs based on this state
   *
   * @example
   * // would close all the tabs for having resource 2
   * closeTabsWhere({ resource: 2 })
   */
  closeTabsWhere = (tabQuery: TabQuery) => {
    this.setState(({ tabs: prevTabs }) => {
      const newTabs = filter(prevTabs, negate(matches({ data: tabQuery })))
      const newActiveTabId = newTabs[newTabs.length - 1]?.id
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      }
    })
  }

  /**
   * Focus the particular tab
   *
   * @param tabId - id of the tab to be focused
   */
  focusTab = (tabId: string) => {
    this.setState({ activeTabId: tabId })
  }

  resolveTabData = async (tabId: string) => {
    const fetchData = this.state.tabs.find((tab) => tab.id === tabId)?.isLoading
    if (fetchData) {
      try {
        const data = await this.fetchTabData(tabId)
        this.updateTab(tabId, { isLoading: false, data })
      } catch (error) {
        this.updateTab(tabId, { isLoading: false, error })
      }
    }
  }

  /**
   * Helper function to resolve data the tab. This is used whenever data a tab is
   * opened, and data needs to be resolved for the tab.
   *
   * @param tabId - the id of the tab whose data is to be resolved
   */
  fetchTabData = (tabId: string): Promise<TabData> => {
    const [tabType, id] = TabsProvider.getTabTypeAndIdFromTabId(tabId)

    switch (tabType) {
      case TabType.NEW: {
        return this.fetchDataForNewTab()
      }

      case TabType.HISTORY: {
        if (!id) {
          throw new Error('cannot fetch history data without any id')
        }
        return this.fetchDataForHistoryTab(id)
      }

      case TabType.SAVED: {
        if (!id) {
          throw new Error('cannot fetch saved query data without any id')
        }
        return this.fetchDataForSavedTab(id)
      }

      default: {
        throw new Error('Invalid tabType')
      }
    }
  }

  /**
   * Resolve data for a new tab.
   */
  fetchDataForNewTab = async (): Promise<TabData> => {
    const resources = await queryCache.fetchQuery(['resources'], fetchResources)

    return {
      name: 'Untitled Query',
      query: '',
      resource: resources?.[0]?.id,
    }
  }

  /**
   * Resolve data for history tab.
   *
   * @param id - id of the history which is opened in the tab
   */
  fetchDataForHistoryTab = async (id: ID): Promise<TabData> => {
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

  /**
   * Resolve data for saved query tab
   *
   * @param id - id of the saved query which is opened in the tab
   */
  fetchDataForSavedTab = async (id: ID): Promise<TabData> => {
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

  render() {
    return (
      <TabsContext.Provider
        value={{
          tabs: this.state.tabs,
          activeTabId: this.state.activeTabId,
          openTab: this.openTab,
          closeTab: this.closeTab,
          closeTabsWhere: this.closeTabsWhere,
          updateTab: this.updateTab,
          focusTab: this.focusTab,
        }}
      >
        {this.props.children}
      </TabsContext.Provider>
    )
  }
}

export default withNavigate(withRouteParams(TabsProvider))
