import React, { useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Button, Select } from 'antd'
import { CaretRightFilled, SaveOutlined, CodeOutlined } from '@ant-design/icons'
import MonacoEditor from 'react-monaco-editor'
import Editor from 'components/editor'
import clsx from 'clsx'
import { Resource } from 'types/resource'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import { runQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'

type QueryEditorProps = {
  editorWidth: number
  resources: Resource[]
  selectedResource: number
  onResourceChange: (selectedResource: number) => void
  className?: string
  style?: React.CSSProperties
}

export default function QueryEditor({
  editorWidth,
  resources,
  selectedResource,
  onResourceChange,
  className,
  style,
}: QueryEditorProps) {
  const [query, setQuery] = useState('')

  const [runQueryMutation, { isLoading, data, error }] = useMutation(runQuery)

  function handleRunQuery() {
    runQueryMutation({ resource: selectedResource, query })
  }

  const editor = useRef<MonacoEditor | null>(null)

  function handleQueryFormat() {
    editor.current?.editor?.getAction('editor.action.formatDocument').run()
  }

  const [measureContainer, containerBounds] = useMeasure()
  const [tableContainerHeight, setTableContainerHeight] = useState(480)

  return (
    <div
      className={clsx('flex flex-col overflow-hidden', className)}
      style={style}
    >
      <div className="flex items-center px-4 py-3 space-x-3 border-b">
        <Select
          placeholder="Select a resource"
          className="w-48"
          value={selectedResource}
          onChange={onResourceChange}
        >
          {resources?.map((resource) => (
            <Select.Option key={resource.id} value={resource.id}>
              {resource.name}
            </Select.Option>
          ))}
        </Select>
        <div className="w-px h-full bg-gray-200" />
        <div className="text-sm text-gray-800">Untitled query</div>
        <div className="flex-1" />
        <Button icon={<CodeOutlined />} onClick={handleQueryFormat}>
          Beautify
        </Button>
        <Button icon={<SaveOutlined />}>Save</Button>
        <Button
          type="primary"
          icon={<CaretRightFilled />}
          loading={isLoading}
          disabled={isLoading}
          onClick={handleRunQuery}
        >
          Run Query
        </Button>
      </div>

      <div className="flex-1" ref={measureContainer}>
        <div
          style={{
            width: editorWidth,
            height: containerBounds.height - tableContainerHeight,
          }}
        >
          <Editor
            resourceId={selectedResource}
            value={query}
            setValue={setQuery}
            ref={(monacoEditor) => {
              editor.current = monacoEditor
            }}
          />
        </div>
        <ResizableBox
          className="relative flex-shrink-0 p-4 border-t"
          width={editorWidth}
          height={tableContainerHeight}
          onResize={(event, { size: { height } }) => {
            setTableContainerHeight(height)
          }}
          axis="y"
          resizeHandles={['n']}
          handle={() => (
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-200 row-resize-handle" />
          )}
        >
          <div className="h-full">
            <ResultsTable data={data} isLoading={isLoading} error={error} />
          </div>
        </ResizableBox>
      </div>
    </div>
  )
}
