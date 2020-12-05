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

  const location = useLocation()
  const activeTabRoute = location.pathname

  useEffect(() => {
    const tabForActiveRoute = tabs.find((tab) => tab.route === activeTabRoute)
    if (!tabForActiveRoute) {
      setTabs((prevTabs) => [...prevTabs, { route: activeTabRoute }])
    }
  }, [activeTabRoute, tabs, setTabs])

  const navigate = useNavigate()

  function createNewTab() {
    const newTabId = v4()
    const newTabRoute = `/queries/new/${newTabId}`
    navigate(newTabRoute)
  }

  function closeTab(tabRoute: string) {
    if (tabRoute === activeTabRoute) {
      const tabIndex = tabs.findIndex((tab) => tab.route === tabRoute)
      if (tabIndex !== -1) {
        const nextTabIndex = tabIndex !== 0 ? tabIndex - 1 : tabIndex + 1
        const nextTabRoute = tabs[nextTabIndex]?.route
        if (nextTabRoute) {
          navigate(nextTabRoute)
        } else {
          createNewTab()
        }
      }
    }

    setTabs((prevTabs) => prevTabs.filter((tab) => tab.route !== tabRoute))
  }

  function focusTab(tabRoute: string) {
    navigate(tabRoute)
  }

  const updateTabName = useCallback(
    (tabRoute: string, tabName: string) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.route === tabRoute ? { ...tab, name: tabName } : tab,
        ),
      )
    },
    [setTabs],
  )

  const updateTabUnsavedState = useCallback(
    (tabRoute: string, unsavedState: boolean) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.route === tabRoute
            ? { ...tab, hasUnsavedChanges: unsavedState }
            : tab,
        ),
      )
    },
    [setTabs],
  )

  return (
    <TabsContext.Provider value={{ updateTabName, updateTabUnsavedState }}>
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
        </HorizontalPane>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            type="editable-card"
            className="editors-tab"
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
                      {tab.name ?? 'Untitled Query'}
                    </span>
                    {tab.hasUnsavedChanges ? (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
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
