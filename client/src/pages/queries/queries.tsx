import React, { useEffect, useCallback } from 'react'
import HorizontalPane from 'components/horizontal-pane'
import { Empty, Tabs } from 'antd'
import { matchRoutes, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { queryCache } from 'react-query'
import usePersistedReducer from 'hooks/use-persisted-reducer'
import { usePrevious } from 'hooks/use-previous'
import { HistoryTabData, SavedQueryTabData, TabType } from 'types/tab'
import {
  OpenInTabOptions,
  QueryTabsContext,
  UpdateTabOptions,
} from './contexts/query-tabs-context'
import HistoriesTab from './components/histories-tab'
import SavedQueriesTab from './components/saved-queries-tab'
import SchemaTab from './components/schema-tab'
import { ActionTypes, reducer } from './reducers/query-tab'
import { fetchHistory } from './queries-and-mutations'

export default function Queries() {
  const [state, dispatch] = usePersistedReducer({
    reducer,
    key: 'query-tabs',
    initialState: { tabs: [] },
  })

  const createNewTab = useCallback(() => {
    dispatch({ type: ActionTypes.CREATE_NEW_TAB })
  }, [dispatch])

  const openInTab = useCallback(
    (options: OpenInTabOptions) => {
      dispatch({ type: ActionTypes.OPEN_IN_TAB, payload: options })
    },
    [dispatch],
  )

  const updateTab = useCallback(
    (options: UpdateTabOptions) => {
      dispatch({ type: ActionTypes.UPDATE_TAB, payload: options })
    },
    [dispatch],
  )

  const closeTab = useCallback(
    (tabId: string) => {
      dispatch({ type: ActionTypes.CLOSE_TAB, payload: { tabId } })
    },
    [dispatch],
  )

  const focusTab = useCallback(
    (tabId: string) => {
      dispatch({ type: ActionTypes.FOCUS_TAB, payload: { tabId } })
    },
    [dispatch],
  )

  const { tabs, activeTabId } = state

  useEffect(() => {
    if (state.tabs.length > 0) {
      if (!activeTabId) {
        focusTab(state.tabs[0].id)
      }
    } else {
      createNewTab()
    }
  }, [state.tabs, focusTab, createNewTab, activeTabId])

  const activeTab = tabs.find((tab) => tab.id === state.activeTabId)

  const navigate = useNavigate()

  const prevActiveTabId = usePrevious(activeTabId)
  useEffect(() => {
    if (activeTabId !== prevActiveTabId) {
      if (activeTabId && activeTab) {
        const { type, id: tabId } = activeTab
        switch (type) {
          case TabType.HISTORY: {
            navigate(`history/${(activeTab.data as HistoryTabData).id}`)
            break
          }
          case TabType.SAVED_QUERY: {
            navigate(`saved/${(activeTab.data as SavedQueryTabData).id}`)
            break
          }
          case TabType.UNSAVED: {
            navigate(`new/${tabId}`)
            break
          }
        }
      } else {
        navigate('')
      }
    }
  }, [activeTabId, prevActiveTabId, activeTab, navigate])

  const location = useLocation()
  useEffect(() => {
    const matchedRoute = matchRoutes(
      [
        // @ts-ignore
        { path: 'new/:tabId', caseSensitive: false, tabType: TabType.UNSAVED },
        // @ts-ignore
        {
          path: 'history/:historyId',
          caseSensitive: false,
          // @ts-ignore
          tabType: TabType.HISTORY,
        },
        // @ts-ignore
        {
          path: 'saved/:queryId',
          caseSensitive: false,
          // @ts-ignore
          tabType: TabType.SAVED_QUERY,
        },
      ],
      location.pathname,
      'queries',
    )
    if (matchedRoute?.length) {
      const {
        // @ts-ignore
        route: { tabType },
        params,
      } = matchedRoute[0]
      if (tabType === TabType.UNSAVED) {
      } else if (tabType === TabType.HISTORY) {
        const tabPresent = tabs.find(
          (tab) =>
            tab.type === TabType.HISTORY &&
            tab.data.id === Number.parseInt(params.historyId, 10),
        )
        if (tabPresent) {
          focusTab(tabPresent.id)
        } else {
          queryCache
            .fetchQuery(['history', params.historyId], () =>
              fetchHistory(params.historyId),
            )
            .then((historyData) => {
              openInTab({ type: TabType.HISTORY, data: historyData })
            })
        }
      } else if (tabType === TabType.SAVED_QUERY) {
      }
    }
  }, [location.pathname, tabs, focusTab, openInTab])

  return (
    <QueryTabsContext.Provider
      value={{
        tabs,
        activeTabId,
        createNewTab,
        openInTab,
        closeTab,
        updateTab,
        focusTab,
      }}
    >
      <div className="flex flex-1 h-full">
        <HorizontalPane
          initialWidth={320}
          maxConstraint={400}
          minConstraint={280}
          buffer={80}
          className="z-10 flex flex-col flex-shrink-0 h-full bg-white border-r"
        >
          <Tabs className="flex-1 queries-tab mt-0.5" size="small" centered>
            <Tabs.TabPane tab="Schema" key="schema">
              {activeTab?.data.resource?.id ? (
                <SchemaTab resourceId={activeTab?.data.resource?.id} />
              ) : (
                <Empty
                  className="flex flex-col items-center justify-center h-full my-0"
                  description={
                    <span className="text-xs">
                      Select a resource to view its schema
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="History" key="history">
              <HistoriesTab />
            </Tabs.TabPane>
            <Tabs.TabPane key="saved" tab="Saved">
              <SavedQueriesTab />
            </Tabs.TabPane>
          </Tabs>
        </HorizontalPane>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            type="editable-card"
            className="editors-tab"
            activeKey={activeTabId}
            onChange={focusTab}
            onEdit={(tabKey, action) => {
              if (action === 'add') {
                createNewTab()
              } else if (action === 'remove') {
                closeTab(tabKey as string)
              }
            }}
          >
            {tabs.map((tab) => (
              <Tabs.TabPane
                key={tab.id}
                tab={<span className="text-xs">{tab.name}</span>}
              />
            ))}
          </Tabs>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </QueryTabsContext.Provider>
  )
}
