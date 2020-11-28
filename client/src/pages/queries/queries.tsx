import React, { useContext, useState } from 'react'
import { Empty, Tabs } from 'antd'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import { QueryTabsContext } from 'contexts/query-tabs-context'
import HistoryTab from './components/history-tab'
import SavedTab from './components/saved-tab'
import QueryTab from './components/query-tab'
import SchemaTab from './components/schema-tab'

export default function Queries() {
  const [measureContainer, containerBounds] = useMeasure()
  const [sidebarWidth, setSidebarWidth] = useState(320)

  const { tabs, activeTabId, focusTab, createNewTab, closeTab } = useContext(
    QueryTabsContext,
  )
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div className="flex flex-1 h-full" ref={measureContainer}>
      <ResizableBox
        width={sidebarWidth}
        height={containerBounds.height}
        onResize={(event, { size: { width } }) => {
          setSidebarWidth(width)
        }}
        className="relative z-10 flex flex-col flex-shrink-0 h-full bg-white border-r"
        axis="x"
        resizeHandles={['e']}
        minConstraints={[280, containerBounds.height]}
        maxConstraints={[400, containerBounds.height]}
        handle={() => (
          <div className="absolute top-0 right-0 w-1 h-full transform translate-x-1/2 bg-gray-200 opacity-0 col-resize-handle hover:opacity-50" />
        )}
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
            <HistoryTab />
          </Tabs.TabPane>
          <Tabs.TabPane key="saved" tab="Saved">
            <SavedTab />
          </Tabs.TabPane>
        </Tabs>
      </ResizableBox>
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
          {activeTab ? (
            <QueryTab
              width={containerBounds.width - sidebarWidth}
              tab={activeTab}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
