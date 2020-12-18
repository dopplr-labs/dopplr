import qs from 'querystring'
import React, { useCallback, useEffect } from 'react'
import { Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import usePersistedSetState from 'hooks/use-persisted-state'
import HorizontalPane from 'components/horizontal-pane'
import HistoriesTab from './components/histories-tab'
import SavedQueriesTab from './components/saved-queries-tab'
import { TabsContext } from './contexts/tabs-context'

type Tab = {
  route: string
  name?: string
  hasUnsavedChanges?: boolean
}

export default function Queries() {
  const [tabs, setTabs] = usePersistedSetState<Tab[]>('queries-tab', [])

  const { pathname: activeTabRoute, search } = useLocation()
  const routeReplaced = Boolean(qs.parse(search.substr(1))?.replace)
  const navigate = useNavigate()

  const createNewTab = useCallback(() => {
    const newTabId = v4()
    const newTabRoute = `/queries/new/${newTabId}`

    setTabs((prevTabs) => [...prevTabs, { route: newTabRoute }])

    navigate(newTabRoute)
  }, [navigate, setTabs])

  const focusTab = useCallback(
    (tabRoute: string, replaceRoute: boolean = false) => {
      navigate(tabRoute, { replace: replaceRoute })
    },
    [navigate],
  )

  const closeTab = useCallback(
    (tabRoute: string) => {
      if (tabRoute === activeTabRoute) {
        const tabIndex = tabs.findIndex((tab) => tab.route === tabRoute)
        if (tabIndex !== -1) {
          const nextTabIndex = tabIndex !== 0 ? tabIndex - 1 : tabIndex + 1
          const nextTabRoute = tabs[nextTabIndex]?.route
          if (nextTabRoute) {
            focusTab(nextTabRoute, true)
          } else {
            createNewTab()
          }
        }
      }

      setTabs((prevTabs) => prevTabs.filter((tab) => tab.route !== tabRoute))
    },
    [setTabs, activeTabRoute, createNewTab, focusTab, tabs],
  )

  const updateTab = useCallback(
    ({
      tabRoute,
      name,
      unsavedState,
      newRoute,
    }: {
      tabRoute: string
      name?: string
      unsavedState?: boolean
      newRoute?: string
    }) => {
      setTabs((prevTabs) => {
        const tabFound = prevTabs.find((tab) => tab.route === tabRoute)
        if (!tabFound) {
          return prevTabs
        }

        const hasNameChanged =
          typeof name !== 'undefined' && tabFound.name !== name
        const hasUnsavedStateChanged =
          typeof unsavedState !== 'undefined' &&
          tabFound.hasUnsavedChanges !== unsavedState
        const hasRouteChanged =
          typeof newRoute !== 'undefined' && tabFound.route !== newRoute

        if (hasNameChanged || hasUnsavedStateChanged || hasRouteChanged) {
          return prevTabs.map((tab) =>
            tab.route === tabRoute
              ? {
                  ...tab,
                  name: name ?? tab.name,
                  hasUnsavedChanges: unsavedState ?? tab.hasUnsavedChanges,
                  route: newRoute ?? tab.route,
                }
              : tab,
          )
        }

        return prevTabs
      })
    },
    [setTabs],
  )

  useEffect(
    function openTabForRoute() {
      if (activeTabRoute === '/queries') {
        if (tabs[0]?.route) {
          focusTab(tabs[0].route, true)
        } else {
          createNewTab()
        }
      } else {
        const tabForActiveRoute = tabs.find(
          (tab) => tab.route === activeTabRoute,
        )
        if (!tabForActiveRoute && !routeReplaced) {
          setTabs((prevTabs) => [...prevTabs, { route: activeTabRoute }])
        }
      }
    },
    [activeTabRoute, focusTab, createNewTab, setTabs, tabs, routeReplaced],
  )

  return (
    <TabsContext.Provider value={{ updateTab }}>
      <div className="flex flex-1 h-full">
        <HorizontalPane
          paneName="tab-horizontal-pane"
          initialWidth={320}
          maxConstraint={400}
          minConstraint={280}
          buffer={80}
          render={({ paneWidth, dragHandle }) => (
            <div
              className="relative z-10 flex flex-col flex-shrink-0 h-full bg-white border-r"
              style={{ width: paneWidth }}
            >
              <Tabs className="flex-1 queries-tab mt-0.5" size="small" centered>
                <Tabs.TabPane tab="Schema" key="schema">
                  <div
                    className="w-full h-full overflow-hidden"
                    id="schema-container"
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="History" key="history">
                  <HistoriesTab />
                </Tabs.TabPane>
                <Tabs.TabPane key="saved" tab="Saved">
                  <SavedQueriesTab />
                </Tabs.TabPane>
              </Tabs>
              {dragHandle}
            </div>
          )}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            type="editable-card"
            className="flex-shrink-0 editors-tab"
            activeKey={activeTabRoute}
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
                key={tab.route}
                tab={
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">
                      {tab.name || 'Untitled Query'}
                    </span>
                    {tab.hasUnsavedChanges ? (
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    ) : null}
                  </div>
                }
              />
            ))}
          </Tabs>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </TabsContext.Provider>
  )
}
