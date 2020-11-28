import React, { useContext, useState } from 'react'
import { useMutation, queryCache } from 'react-query'
import { Button, Empty, Select } from 'antd'
import {
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import Editor from 'components/editor'
import clsx from 'clsx'
import { Resource } from 'types/resource'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import sqlFormatter from 'sql-formatter'
import { Tab, TabType } from 'types/tab'
import { QueryTabsContext } from 'contexts/query-tabs-context'
import { SavedQuery } from 'types/query'
import { runQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'
import QueryName from './query-name'
import SaveQueryModal from './save-query-modal'

type QueryEditorProps = {
  editorWidth: number
  resources: Resource[]
  tab: Tab
  className?: string
  style?: React.CSSProperties
}

export default function QueryEditor({
  editorWidth,
  resources,
  tab,
  className,
  style,
}: QueryEditorProps) {
  const { updateTab } = useContext(QueryTabsContext)

  const {
    id,
    type,
    data: { query, resource },
  } = tab

  const [runQueryMutation, { isLoading, data, error }] = useMutation(runQuery, {
    onSuccess: () => {
      queryCache.refetchQueries(['history'])
    },
  })
  function handleRunQuery() {
    if (resource) {
      runQueryMutation({ resource: resource.id, query })
    }
  }

  function updateResource(selectedResourceId: number) {
    updateTab({
      id,
      type,
      data: {
        resource: resources?.find(
          (resource) => resource.id === selectedResourceId,
        ),
      },
    })
  }

  function updateQuery(updatedQuery: string) {
    updateTab({
      id,
      type,
      name:
        type !== TabType.SAVED_QUERY
          ? updatedQuery.length > 15
            ? `${updatedQuery.slice(0, 15)}...`
            : updatedQuery || 'Untitled Query'
          : tab.name,
      data: {
        query: updatedQuery,
      },
    })
  }

  function handleFormatQuery() {
    updateQuery(sqlFormatter.format(query.replace(/\r\n/g, '\n')))
  }

  const [measureContainer, containerBounds] = useMeasure()
  const [tableContainerHeight, setTableContainerHeight] = useState(480)

  const [saveModalVisible, setSaveModalVisible] = useState(false)

  function handleSaveQuery() {
    setSaveModalVisible(true)
  }

  function handleModalRequestClose() {
    setSaveModalVisible(false)
  }

  function handleQuerySaveComplete(savedQuery: SavedQuery) {
    updateTab({
      id,
      type: TabType.SAVED_QUERY,
      name: savedQuery.name,
      data: savedQuery,
    })
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-xs">
              No resources have been created. Create a resource to run query
            </span>
          }
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Create Resource
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <>
      <div
        className={clsx('flex flex-col overflow-hidden', className)}
        style={style}
      >
        <div className="flex items-center px-4 py-3 space-x-3 border-b">
          <Select
            placeholder="Select a resource"
            className="w-48"
            value={resource.id}
            onChange={updateResource}
          >
            {resources?.map((resource) => (
              <Select.Option key={resource.id} value={resource.id}>
                {resource.name}
              </Select.Option>
            ))}
          </Select>
          {type === TabType.SAVED_QUERY ? (
            <>
              <div className="w-px h-full bg-gray-200" />
              <QueryName className="flex-1" tab={tab} onUpdate={() => {}} />
            </>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex-1" />
          <Button icon={<CodeOutlined />} onClick={handleFormatQuery}>
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
              resourceId={resource.id}
              value={query}
              setValue={updateQuery}
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
              <div className="absolute top-0 left-0 right-0 h-1 transform -translate-y-1/2 bg-gray-200 opacity-0 row-resize-handle hover:opacity-50" />
            )}
          >
            <div className="h-full">
              <ResultsTable data={data} isLoading={isLoading} error={error} />
            </div>
          </ResizableBox>
        </div>
      </div>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={handleModalRequestClose}
        query={tab.data.query}
        resourceId={resource.id}
        onSave={handleQuerySaveComplete}
      />
    </>
  )
}
