import React from 'react'
import { Tooltip, Tabs } from 'antd'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { RectReadOnly } from 'react-use-measure'
import {
  BorderHorizontalOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import Editor from 'components/editor'
import HorizontalPane from 'components/horizontal-pane'
import EditorContext from 'contexts/editor-context'
import { QueryResult } from 'types/query'
import ResultsTable from './results-table'
import ChartTab from './chart-tab'

type VerticalOrientationProps = {
  handleHorizontalSplit: () => void
  resourceId: number
  query: string
  setQuery: (udpatedValue: string) => void
  editorAction: monaco.editor.IActionDescriptor[]
  containerBounds: RectReadOnly
  queryResult: QueryResult | null
  isRunningQuery: boolean
  error: any
}

export default function VerticalOrientation({
  handleHorizontalSplit,
  resourceId,
  query,
  setQuery,
  editorAction,
  containerBounds,
  queryResult,
  isRunningQuery,
  error,
}: VerticalOrientationProps) {
  const { pathname } = useLocation()
  const isSaved = pathname.split('/')[2] === 'saved'
  const queryId = pathname.split('/')[3]
  return (
    <HorizontalPane
      paneName="editor-horizontal-pane"
      initialWidth={640}
      maxConstraint={800}
      minConstraint={320}
      buffer={160}
      render={({ paneWidth, isPaneClose, dragHandle, toggleFullScreen }) => {
        const headerIcons = (
          <div className="space-x-4">
            <Tooltip
              title="Split Horizontally"
              placement="left"
              mouseEnterDelay={1}
            >
              <button
                className="focus:outline-none"
                onClick={handleHorizontalSplit}
              >
                <BorderHorizontalOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Fullscreen" placement="left" mouseEnterDelay={1}>
              <button className="focus:outline-none" onClick={toggleFullScreen}>
                {isPaneClose ? <RightOutlined /> : <LeftOutlined />}
              </button>
            </Tooltip>
          </div>
        )

        return (
          <>
            <div
              className="relative z-10 flex flex-col h-full border-r"
              style={{ width: paneWidth }}
            >
              <Editor
                resourceId={resourceId}
                value={query}
                setValue={setQuery}
                editorAction={editorAction}
              />
              {dragHandle}
            </div>
            <div
              className="h-full"
              style={{ width: containerBounds.width - paneWidth }}
            >
              <Tabs
                defaultActiveKey="1"
                className="h-full px-4 queries-tab"
                size="small"
                tabBarExtraContent={headerIcons}
              >
                <Tabs.TabPane tab="Table" key="1">
                  <div className="h-full">
                    <ResultsTable
                      data={queryResult}
                      isLoading={isRunningQuery}
                      error={error}
                    />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Charts" key="2">
                  <EditorContext.Provider
                    value={{ isSaved, queryId, queryResult }}
                  >
                    <ChartTab />
                  </EditorContext.Provider>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </>
        )
      }}
    />
  )
}
