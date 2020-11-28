import React, { useState } from 'react'
import { Tabs } from 'antd'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import { range } from 'lodash-es'
import HistoryTab from './components/history-tab'
import SavedTab from './components/saved-tab'
import QueryTab from './components/query-tab'

export default function Queries() {
  const [measureContainer, containerBounds] = useMeasure()
  const [sidebarWidth, setSidebarWidth] = useState(320)

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
        minConstraints={[200, containerBounds.height]}
        maxConstraints={[360, containerBounds.height]}
        handle={() => (
          <div className="absolute top-0 right-0 w-1 h-full transform translate-x-1/2 bg-gray-200 opacity-0 col-resize-handle hover:opacity-50" />
        )}
      >
        <Tabs className="flex-1 queries-tab" size="small" centered>
          <Tabs.TabPane tab="Schema" key="schema" />
          <Tabs.TabPane tab="History" key="history">
            <HistoryTab />
          </Tabs.TabPane>
          <Tabs.TabPane key="saved" tab="Saved">
            <SavedTab />
          </Tabs.TabPane>
        </Tabs>
      </ResizableBox>
      <div className="flex flex-col flex-1">
        <Tabs type="editable-card" className="editors-tab">
          {range(4).map((val) => (
            <Tabs.TabPane
              key={val}
              tab={<span className="text-xs">Untitled Request</span>}
            />
          ))}
        </Tabs>
        <div className="flex-1">
          <QueryTab
            width={containerBounds.width - sidebarWidth}
            queryName="Untitled Query"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
