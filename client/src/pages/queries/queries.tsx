import React from 'react'
import { Empty, Tabs } from 'antd'
import QueryTab from './components/query-tab'

export default function Queries() {
  return (
    <div className="flex flex-1 h-full">
      <div className="flex flex-col h-full overflow-y-auto border-r w-72">
        <Tabs className="flex-1 queries-tab" size="small" centered>
          <Tabs.TabPane tab="History" key="history">
            <div className="flex items-center justify-center h-full">
              <Empty
                description={
                  <span className="text-xs">Run your first query</span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Saved" key="saved">
            <div className="flex items-center justify-center h-full">
              <Empty
                description={
                  <span className="text-xs">Run your first query</span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className="flex flex-col flex-1 pt-4 tabs-container">
        <Tabs
          type="editable-card"
          tabBarExtraContent={{ left: <div className="w-4" /> }}
          className="h-full queries-tab"
          tabBarStyle={{ marginBottom: 0 }}
        >
          <Tabs.TabPane
            tab={<span className="text-xs text-gray-800">Untitled Query</span>}
            className="w-full"
          >
            <QueryTab />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
