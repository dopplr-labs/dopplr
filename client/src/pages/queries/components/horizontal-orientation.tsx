import React from 'react'
import { Tooltip, Tabs } from 'antd'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { RectReadOnly } from 'react-use-measure'
import { useLocation } from 'react-router-dom'
import {
  BorderVerticleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import VerticalPane from 'components/vertical-pane'
import Editor from 'components/editor'
import EditorContext from 'contexts/editor-context'
import { QueryResult } from 'types/query'
import ResultsTable from './results-table'
import ChartTab from './chart-tab'

type HorizontalOrientationProps = {
  handleVerticalSplit: () => void
  resourceId: number
  query: string
  setQuery: (udpatedValue: string) => void
  editorAction: monaco.editor.IActionDescriptor[]
  containerBounds: RectReadOnly
  queryResult: QueryResult | null
  isRunningQuery: boolean
  error: any
}

export default function HorizontalOrientation({
  handleVerticalSplit,
  resourceId,
  query,
  setQuery,
  editorAction,
  containerBounds,
  queryResult,
  isRunningQuery,
  error,
}: HorizontalOrientationProps) {
  const { pathname } = useLocation()
  const isSaved = pathname.split('/')[2] === 'saved'
  const queryId = pathname.split('/')[3]
  return (
    <VerticalPane
      paneName="editor-vertical-pane"
      initialHeight={480}
      maxHeight={containerBounds.height}
      maxConstraint={containerBounds.height - 160}
      buffer={80}
      render={({ paneHeight, isFullScreen, dragHandle, toggleFullScreen }) => {
        const headerIcons = (
          <div className="space-x-4">
            <Tooltip
              placement="left"
              title="Split Vertically"
              mouseEnterDelay={1}
            >
              <button
                className="focus:outline-none"
                onClick={handleVerticalSplit}
              >
                <BorderVerticleOutlined />
              </button>
            </Tooltip>
            <Tooltip placement="left" title="Fullscreen" mouseEnterDelay={1}>
              <button className="focus:outline-none" onClick={toggleFullScreen}>
                {isFullScreen ? <DownOutlined /> : <UpOutlined />}
              </button>
            </Tooltip>
          </div>
        )

        return (
          <>
            {!isFullScreen ? (
              <div
                className="w-full"
                style={{ height: containerBounds.height - paneHeight }}
              >
                <Editor
                  resourceId={resourceId}
                  value={query}
                  setValue={setQuery}
                  editorAction={editorAction}
                />
              </div>
            ) : null}
            <div className="relative border-t" style={{ height: paneHeight }}>
              {dragHandle}
              <Tabs
                defaultActiveKey="1"
                size="small"
                className="w-full h-full px-4 py-1 queries-tab"
                tabBarExtraContent={headerIcons}
              >
                <Tabs.TabPane tab="Table" key="1">
                  <div className="w-full h-full">
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
