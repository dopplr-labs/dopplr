import React, { useState } from 'react'
import { Tabs } from 'antd'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import { ClockCircleOutlined, SaveOutlined } from '@ant-design/icons'
import QueryTab from './components/query-tab'
import HistoryTab from './components/history-tab'
import SavedTab from './components/saved-tab'

export default function Queries() {
  const [queryName, setQueryName] = useState('Untitled Query')

  const [measureContainer, containerBounds] = useMeasure()
  const [sidebarWidth, setSidebarWidth] = useState(288)

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQueryName(event.target.value)
  }

  return (
    <div className="flex flex-1 h-full" ref={measureContainer}>
      <ResizableBox
        width={sidebarWidth}
        height={containerBounds.height}
        onResize={(event, { size: { width } }) => {
          setSidebarWidth(width)
        }}
        className="relative flex flex-col flex-shrink-0 h-full overflow-y-auto"
        axis="x"
        resizeHandles={['e']}
        minConstraints={[200, containerBounds.height]}
        maxConstraints={[360, containerBounds.height]}
        handle={() => (
          <div className="absolute top-0 right-0 w-px h-full bg-gray-200 col-resize-handle" />
        )}
      >
        <Tabs
          className="flex-1 mt-1 queries-tab"
          size="small"
          centered
          tabBarGutter={16}
        >
          <Tabs.TabPane
            tab={
              <span className="px-4">
                <ClockCircleOutlined />
                <span>History</span>
              </span>
            }
            key="history"
          >
            <HistoryTab />
          </Tabs.TabPane>
          <Tabs.TabPane
            key="saved"
            tab={
              <span className="px-4">
                <SaveOutlined />
                <span>Saved</span>
              </span>
            }
          >
            <SavedTab />
          </Tabs.TabPane>
        </Tabs>
      </ResizableBox>

      <div className="flex flex-col flex-1 tabs-container">
        <Tabs
          type="editable-card"
          className="h-full queries-tab"
          tabBarStyle={{ marginBottom: 0 }}
        >
          <Tabs.TabPane
            tab={<span className="text-xs">{queryName}</span>}
            className="w-full"
          >
            <QueryTab
              queryName={queryName}
              width={containerBounds.width - sidebarWidth}
              onChange={handleNameChange}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
