import React, { useContext } from 'react'
import { Tabs } from 'antd'
import HorizontalPane from 'components/horizontal-pane'
import { TabsContext, TabType } from 'components/tabs-provider'
import HistoriesTab from './components/histories-tab'
import SavedQueriesTab from './components/saved-queries-tab'

export default function Queries() {
  const { activeTabId, focusTab, openTab, closeTab, tabs } = useContext(
    TabsContext,
  )

  return (
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
          activeKey={activeTabId}
          onChange={focusTab}
          onEdit={(tabKey, action) => {
            if (action === 'add') {
              openTab(TabType.NEW)
            } else if (action === 'remove' && typeof tabKey === 'string') {
              const [tabType, ...rest] = tabKey.split('-')
              const tabId = rest.join('-')
              closeTab(tabType as TabType, tabId)
            }
          }}
        >
          {tabs.map((tab) => (
            <Tabs.TabPane
              key={tab.id}
              tab={
                <div className="flex items-center space-x-2">
                  <span className="text-xs">
                    {tab.data?.name || 'Untitled Query'}
                  </span>
                  {tab.hasUnsavedChange ? (
                    <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  ) : null}
                </div>
              }
            />
          ))}
        </Tabs>
        <div className="flex-1" />
      </div>
    </div>
  )
}
