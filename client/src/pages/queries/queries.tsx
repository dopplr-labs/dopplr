import React from 'react'
import { Empty, Tabs } from 'antd'
import useMeasure from 'react-use-measure'
import QueryTab from './components/query-tab'

export default function Queries() {
  const [measureContainer, containerBounds] = useMeasure()
  const [measureSideBar, sideBarBounds] = useMeasure()

  return (
    <div className="flex flex-1 h-full" ref={measureContainer}>
      <div
        className="flex flex-col flex-shrink-0 h-full overflow-y-auto border-r w-72"
        ref={measureSideBar}
      >
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
            tab={<span className="text-xs">Untitled Query</span>}
            className="w-full"
          >
            <QueryTab width={containerBounds.width - sideBarBounds.width} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
