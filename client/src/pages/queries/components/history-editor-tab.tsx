import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { QueryResult, SavedQuery } from 'types/query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchResources } from 'pages/resources/queries'
import usePersistedSetState from 'hooks/use-persisted-state'
import { createPortal } from 'react-dom'
import { fetchHistory, runQuery } from '../queries-and-mutations'
import ResultsTable from './results-table'
import SaveQueryModal from './save-query-modal'
import { TabsContext } from '../contexts/tabs-context'
import SchemaTab from './schema-tab'

function useUpdateTabOnQueryChange({
  tabRoute,
  query,
  originalQuery,
  resource,
  originalResource,
}: {
  tabRoute: string
  query: string
  originalQuery?: string
  resource: number | null
  originalResource?: number
}) {
  const { updateTab } = useContext(TabsContext)
  useEffect(
    function updateTabOnQueryChange() {
      const tabName = query.length > 15 ? `${query.slice(0, 12)}...` : query
      const hasQueryChanged =
        typeof originalQuery !== 'undefined' && query !== originalQuery
      const hasResourceChanged =
        resource !== null &&
        typeof originalResource !== 'undefined' &&
        resource !== originalResource
      updateTab({
        tabRoute,
        name: tabName,
        unsavedState: hasQueryChanged || hasResourceChanged,
      })
    },
    [query, tabRoute, updateTab, originalQuery, originalResource, resource],
  )
}

function Tab() {
  const { pathname: tabRoute } = useLocation()

  const [query, setQuery] = usePersistedSetState(`${tabRoute}-query`, '')

  const [selectedResourceId, setSelectedResourceId] = usePersistedSetState<
    number | null
  >(`${tabRoute}-resource`, null)
  const {
    isLoading: isLoadingResource,
    data: resources,
    error: resourcesError,
  } = useQuery(['resources'], fetchResources)

  const { historyId: idFromParams } = useParams()
  const id = Number.parseInt(idFromParams, 10)
  const {
    isLoading: isLoadingHistory,
    data: history,
    error: historyError,
  } = useQuery(['history', id], () => fetchHistory(id), {
    onSettled: (dataFetched) => {
      if (dataFetched) {
        setQuery(dataFetched.query)
        setSelectedResourceId(dataFetched.resource.id)
      }
    },
  })

  useUpdateTabOnQueryChange({
    tabRoute,
    query,
    originalQuery: history?.query,
    resource: selectedResourceId,
    originalResource: history?.resource.id,
  })

  const [
    queryResult,
    setQueryResult,
  ] = usePersistedSetState<QueryResult | null>(`${tabRoute}-query-result`, null)
  const [
    runQueryMutation,
    { isLoading: isRunningQuery, error: queryResultError },
  ] = useMutation(runQuery, {
    onSuccess: (runQueryResult) => {
      queryCache.refetchQueries(['history'])
      setQueryResult(runQueryResult)
    },
  })

  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const navigate = useNavigate()
  const { updateTab } = useContext(TabsContext)
  function handleQuerySaveComplete(savedQuery: SavedQuery) {
    navigate(`/queries/saved/${savedQuery.id}?replace=true`, { replace: true })
    updateTab({
      tabRoute,
      name: savedQuery.name,
      unsavedState: false,
      newRoute: `/queries/saved/${savedQuery.id}`,
    })
  }

  const [measureContainer, containerBounds] = useMeasure()

  if (isLoadingResource || isLoadingHistory) {
    return (
      <div className="flex h-full px-4 space-x-4">
        <div className="flex-1 py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-10 bg-background-secondary animate-pulse" />
            <div className="flex-1" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
            <div className="w-24 h-10 bg-background-secondary animate-pulse" />
          </div>
          <div className="w-full bg-background-secondary h-80 animate-pulse" />
          <div className="w-full h-40 bg-background-secondary animate-pulse" />
        </div>
      </div>
    )
  }

  if (resourcesError || historyError) {
    return (
      <Result
        status="warning"
        subTitle={
          (resourcesError as any).message ?? (historyError as any).message
        }
      />
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
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              setQuery(sqlFormatter.format(query.replace(/\r\n/g, '\n')))
            }}
          >
            Beautify
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={() => {
              setSaveModalVisible(true)
            }}
          >
            Save
          </Button>
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            loading={isRunningQuery}
            disabled={isRunningQuery}
            onClick={() => {
              if (selectedResourceId) {
                runQueryMutation({ resource: selectedResourceId, query })
              }
            }}
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
                      setValue={setQuery}
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
                      isLoading={isRunningQuery}
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
        onRequestClose={() => {
          setSaveModalVisible(false)
        }}
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

export default function UnsavedQueryEditorTab() {
  const { pathname: tabRoute } = useLocation()

  return useMemo(() => <Tab key={tabRoute} />, [tabRoute])
}
