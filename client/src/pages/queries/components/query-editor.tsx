import React, { useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { Input, Button, Table, Select } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import MonacoEditor from 'react-monaco-editor'
import Editor from 'components/editor'
import clsx from 'clsx'
import useMeasure from 'react-use-measure'
import { Resource } from 'types/resource'
import { runQuery } from '../queries-and-mutations'

const PAGINATION_CONTAINER_HEIGHT = 56

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

  const [runQueryMutation, { isLoading, data }] = useMutation(runQuery)

  function handleRunQuery() {
    runQueryMutation({ resource: selectedResource, query })
  }

  const editor = useRef<MonacoEditor | null>(null)

  function handleQueryFormat() {
    editor.current?.editor?.getAction('editor.action.formatDocument').run()
  }

  const [measureTableContainer, tableContainerBounds] = useMeasure()
  const [tableHeaderSize, setTableHeaderSize] = useState<number | undefined>(
    undefined,
  )

  return (
    <div className={clsx('flex flex-col', className)} style={style}>
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
      <div className="border-b">
        <Editor
          resourceId={selectedResource}
          value={query}
          setValue={setQuery}
          ref={(monacoEditor) => {
            editor.current = monacoEditor
          }}
          width={editorWidth}
          height={300}
        />
      </div>
      <div className="flex-1 p-4" style={{ width: editorWidth }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end flex-shrink-0 mb-4 gap-x-4">
            <Input
              placeholder="Search Table"
              className="w-64"
              prefix={<SearchOutlined />}
            />
            <Button icon={<DownloadOutlined />}>Download</Button>
          </div>
          <div className="flex-1" ref={measureTableContainer}>
            <Table
              columns={data?.fields.map((field) => ({
                key: field.name,
                title: <span title={field.name}>{field.name}</span>,
                dataIndex: field.name,
                width: 120,
              }))}
              dataSource={data?.rows.map((row: any, index: number) => ({
                key: (index + 1).toString(),
                ...row,
              }))}
              rowClassName="text-xs font-sans"
              size="small"
              loading={isLoading}
              // @ts-ignore
              onHeaderRow={() => ({
                ref: (node: HTMLTableRowElement) => {
                  if (node) {
                    setTableHeaderSize(node?.getBoundingClientRect()?.height)
                  }
                },
              })}
              scroll={{
                x: tableContainerBounds.width,
                y:
                  tableHeaderSize && tableContainerBounds.height
                    ? tableContainerBounds.height -
                      tableHeaderSize -
                      PAGINATION_CONTAINER_HEIGHT
                    : undefined,
              }}
              pagination={{ showSizeChanger: true }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
