import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import * as uuid from 'uuid'
import HorizontalPane from 'components/horizontal-pane'
import { Tabs } from 'antd'
import usePersistedSetState from 'hooks/use-persisted-state'
import { HotKeys, KeyMap } from 'react-hotkeys'
import { TabData, TabType } from './types'
import { useTabs } from './hooks/use-tabs'
import TabsList from './components/tabs-list'
import HistoriesTab from './components/histories-tab'
import SavedQueriesTab from './components/saved-queries-tab'
import SchemaTab from './components/schema-tab'
import TabsContext from './contexts/tabs-context'
import TabsDataContext from './contexts/tabs-data-context'
import QueryEditor from './components/query-editor'
import { hotkeysHandler } from './utils/keyboard'

const keyMap: KeyMap = {
  SAVE_TAB: ['command+s'],
}

export default function Queries() {
  const { tabType, id } = useParams()
  const { pathname } = useLocation()

  const [tabsData, setTabsData] = usePersistedSetState<Record<string, TabData>>(
    'query-tabs-data',
    {},
  )

  const { tabs, removeTab, updateTabRoute } = useTabs(tabsData)

  if (pathname === '/queries') {
    if (tabs.length > 0) {
      return <Navigate to={`/queries/${tabs[0]}`} replace />
    }

    return <Navigate to="new" replace />
  }

  if (tabType === TabType.NEW && typeof id === 'undefined') {
    const newTabId = uuid.v4()
    // instead of using absolute path we can use relative path as we are
    // sure that it would be in the form of /queries/new
    return <Navigate to={newTabId} replace />
  }

  return (
    <TabsContext.Provider
      value={{
        tabs,
        removeTab,
        updateTabRoute,
      }}
    >
      <TabsDataContext.Provider value={{ tabsData, setTabsData }}>
        <HotKeys keyMap={keyMap} handlers={hotkeysHandler} className="h-full">
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
                  {/* Side tabs bar */}
                  <Tabs
                    className="flex-1 queries-tab mt-0.5"
                    size="small"
                    centered
                  >
                    <Tabs.TabPane tab="Schema" key="schema">
                      <SchemaTab />
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
            {/* Tab content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <TabsList />
              <div className="flex-1">
                <QueryEditor />
              </div>
            </div>
          </div>
        </HotKeys>
      </TabsDataContext.Provider>
    </TabsContext.Provider>
  )
}
