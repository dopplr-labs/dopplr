import React, { useEffect, useState } from 'react'
import { useMutation, queryCache } from 'react-query'
import { Button, Input, message, Select } from 'antd'
import { CaretRightFilled, SaveOutlined, CodeOutlined } from '@ant-design/icons'
import Editor from 'components/editor'
import clsx from 'clsx'
import { Resource } from 'types/resource'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import { usePrevious } from 'hooks/use-previous'
import sqlFormatter from 'sql-formatter'
import { runQuery, saveQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'

type QueryEditorProps = {
  queryName: string
  editorWidth: number
  resources: Resource[]
  selectedResource: number
  onResourceChange: (selectedResource: number) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  style?: React.CSSProperties
}

export default function QueryEditor({
  queryName,
  editorWidth,
  resources,
  selectedResource,
  onResourceChange,
  onChange,
  className,
  style,
}: QueryEditorProps) {
  const [query, setQuery] = useState('')
  const [editQueryName, setEditQueryName] = useState(false)

  const [runQueryMutation, { isLoading, data, error }] = useMutation(runQuery, {
    onSuccess: () => {
      queryCache.refetchQueries(['history'])
    },
  })
  function handleRunQuery() {
    runQueryMutation({ resource: selectedResource, query })
  }

  const [saveQueryMutation] = useMutation(saveQuery, {
    onSuccess: () => {
      queryCache.refetchQueries(['saved-queries'])
      message.success('Query saved successfully')
    },
  })
  function handleSaveQuery() {
    saveQueryMutation({ resourceId: selectedResource, query, name: queryName })
  }

  function handleQueryFormat() {
    setQuery((prevState) =>
      sqlFormatter.format(prevState.replace(/\r\n/g, '\n')),
    )
  }

  const [measureContainer, containerBounds] = useMeasure()
  const [tableContainerHeight, setTableContainerHeight] = useState(480)

  const prevResourceSelected = usePrevious(selectedResource)
  useEffect(() => {
    if (selectedResource !== prevResourceSelected) {
      setQuery('')
    }
  }, [prevResourceSelected, selectedResource])

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
        {editQueryName ? (
          <Input
            className="flex-1"
            autoFocus
            value={queryName}
            onFocus={(event) => {
              event.target.select()
            }}
            onChange={onChange}
            onPressEnter={() => {
              setEditQueryName(false)
            }}
            onBlur={() => {
              setEditQueryName(false)
            }}
          />
        ) : (
          <div
            className="flex-1 text-sm text-gray-800 cursor-pointer"
            onClick={() => {
              setEditQueryName(true)
            }}
          >
            {queryName}
          </div>
        )}
        <Button icon={<CodeOutlined />} onClick={handleQueryFormat}>
          Beautify
        </Button>
        <Button icon={<SaveOutlined />} onClick={handleSaveQuery}>
          Save
        </Button>
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
          />
        </div>
        <ResizableBox
          className="relative flex-shrink-0 p-4"
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
