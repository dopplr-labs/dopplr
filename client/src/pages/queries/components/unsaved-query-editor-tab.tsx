import React, { useContext, useEffect, useState } from 'react'
import { useMutation, queryCache, useQuery } from 'react-query'
import { Button, Empty, Result, Select } from 'antd'
import {
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'
import Editor from 'components/editor'
import useMeasure from 'react-use-measure'
import sqlFormatter from 'sql-formatter'
import VerticalPane from 'components/vertical-pane'
import { QueryResult } from 'types/query'
import { useLocation } from 'react-router-dom'
import { fetchResources } from 'pages/resources/queries'
import usePersistedSetState from 'hooks/use-persisted-state'
import { createPortal } from 'react-dom'
import { runQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'
import SaveQueryModal from './save-query-modal'
import { TabsContext } from '../contexts/tabs-context'
import SchemaTab from './schema-tab'

export default function UnsavedQueryEditorTab() {
  const { pathname: tabRoute } = useLocation()

  const [query, setQuery] = usePersistedSetState(`${tabRoute}-query`, '')
  const [selectedResourceId, setSelectedResourceId] = usePersistedSetState<
    number | null
  >(`${tabRoute}-resource`, null)
  const [
    queryResult,
    setQueryResult,
  ] = usePersistedSetState<QueryResult | null>(`${tabRoute}-query-result`, null)

  const {
    isLoading: isLoadingResource,
    data: resources,
    error: resourcesError,
  } = useQuery(['resources'], fetchResources)

  useEffect(
    function selectFirstResourceOnResourceFetch() {
      if (resources?.length && selectedResourceId === null) {
        setSelectedResourceId(resources[0].id)
      }
    },
    [resources, selectedResourceId, setSelectedResourceId],
  )

  const [
    runQueryMutation,
    { isLoading, error: queryResultError },
  ] = useMutation(runQuery, {
    onSuccess: (runQueryResult) => {
      queryCache.refetchQueries(['history'])
      setQueryResult(runQueryResult)
    },
  })

  const { updateTabName } = useContext(TabsContext)

  function handleRunQuery() {
    if (selectedResourceId) {
      runQueryMutation({ resource: selectedResourceId, query })
    }
  }

  function updateQuery(updatedQuery: string) {
    const tabName =
      updatedQuery.length > 15
        ? `${updatedQuery.slice(0, 12)}...`
        : updatedQuery
    updateTabName(tabRoute, tabName)
    setQuery(updatedQuery)
  }

  function handleFormatQuery() {
    updateQuery(sqlFormatter.format(query.replace(/\r\n/g, '\n')))
  }

  const [measureContainer, containerBounds] = useMeasure()

  const [saveModalVisible, setSaveModalVisible] = useState(false)

  function handleSaveQuery() {
    setSaveModalVisible(true)
  }

  function handleModalRequestClose() {
    setSaveModalVisible(false)
  }

  function handleQuerySaveComplete() {}

  if (isLoadingResource) {
    return (
      <div className="flex h-full px-4 space-x-4">
        <div className="flex-1 py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-10 bg-gray-200 animate-pulse" />
            <div className="flex-1" />
            <div className="w-24 h-10 bg-gray-200 animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 animate-pulse" />
          </div>
          <div className="w-full bg-gray-200 h-80 animate-pulse" />
          <div className="w-full h-40 bg-gray-200 animate-pulse" />
        </div>
      </div>
    )
  }

  if (resourcesError) {
    return (
      <Result status="warning" subTitle={(resourcesError as any).message} />
    )
  }

  if (!selectedResourceId) {
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
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center px-4 py-3 space-x-3 border-b">
          <Select
            placeholder="Select a resource"
            className="w-48"
            value={selectedResourceId}
            onChange={setSelectedResourceId}
          >
            {resources?.map((resource) => (
              <Select.Option key={resource.id} value={resource.id}>
                {resource.name}
              </Select.Option>
            ))}
          </Select>
          <div className="flex-1" />
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

        <div className="flex flex-col flex-1" ref={measureContainer}>
          <VerticalPane
            initialHeight={480}
            maxHeight={containerBounds.height}
            maxConstraint={containerBounds.height - 160}
            buffer={80}
            render={({
              paneHeight,
              isFullScreen,
              dragHandle,
              toggleFullScreen,
            }) => (
              <>
                {!isFullScreen ? (
                  <div
                    className="w-full"
                    style={{ height: containerBounds.height - paneHeight }}
                  >
                    <Editor
                      resourceId={selectedResourceId}
                      value={query}
                      setValue={updateQuery}
                    />
                  </div>
                ) : null}
                <div
                  className="relative border-t"
                  style={{ height: paneHeight }}
                >
                  {dragHandle}
                  <div className="flex justify-end px-4 py-2">
                    <button
                      onClick={toggleFullScreen}
                      className="focus:outline-none"
                    >
                      {isFullScreen ? <DownOutlined /> : <UpOutlined />}
                    </button>
                  </div>
                  <div className="h-full px-4">
                    <ResultsTable
                      data={queryResult ?? undefined}
                      isLoading={isLoading}
                      error={queryResultError}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </div>
      </div>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={handleModalRequestClose}
        query={query}
        resourceId={selectedResourceId}
        onSave={handleQuerySaveComplete}
      />
      {createPortal(
        selectedResourceId ? (
          <SchemaTab resourceId={selectedResourceId} />
        ) : (
          <Empty
            className="flex flex-col items-center justify-center h-full my-0"
            description={
              <span className="text-xs">
                Select a resource to view its schema
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
        document.getElementById('schema-container') as HTMLDivElement,
      )}
    </>
  )
}
