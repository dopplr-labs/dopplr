import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, queryCache, useQuery } from 'react-query'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import clsx from 'clsx'
import {
  Button,
  Empty,
  Input,
  message,
  Result,
  Select,
  Tabs,
  Tooltip,
} from 'antd'
import {
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  BorderVerticleOutlined,
  RightOutlined,
  LeftOutlined,
  BorderHorizontalOutlined,
} from '@ant-design/icons'
import Editor from 'components/editor'
import useMeasure from 'react-use-measure'
import sqlFormatter from 'sql-formatter'
import HorizontalPane from 'components/horizontal-pane'
import VerticalPane from 'components/vertical-pane'
import { QueryResult } from 'types/query'
import { useLocation, useParams } from 'react-router-dom'
import { fetchResources } from 'pages/resources/queries'
import usePersistedSetState from 'hooks/use-persisted-state'
import { createPortal } from 'react-dom'
import { formatDuration } from 'utils/time'
import {
  fetchSavedQuery,
  runQuery,
  updateQuery,
} from '../queries-and-mutations'
import ResultsTable from './results-table'
import { TabsContext } from '../contexts/tabs-context'
import SchemaTab from './schema-tab'

enum SplitOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

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
      const hasQueryChanged =
        typeof originalQuery !== 'undefined' && query !== originalQuery
      const hasResourceChanged =
        resource !== null &&
        typeof originalResource !== 'undefined' &&
        resource !== originalResource
      updateTab({
        tabRoute,
        unsavedState: hasQueryChanged || hasResourceChanged,
      })
    },
    [query, tabRoute, updateTab, originalQuery, originalResource, resource],
  )
}

function computeTabName(name: string) {
  return name.length > 15 ? `${name.slice(0, 12)}...` : name
}

function Tab() {
  const { pathname: tabRoute } = useLocation()

  const [splitOrientation, setSplitOrientation] = usePersistedSetState<string>(
    'split-orientation',
    SplitOrientation.HORIZONTAL,
  )

  const [query, setQuery] = usePersistedSetState(`${tabRoute}-query`, '')

  const [queryName, setQueryName] = usePersistedSetState(
    `${tabRoute}-query-name`,
    '',
  )
  const [editQueryName, setEditQueryName] = useState(false)

  const [selectedResourceId, setSelectedResourceId] = usePersistedSetState<
    number | null
  >(`${tabRoute}-resource`, null)
  const {
    isLoading: isLoadingResource,
    data: resources,
    error: resourcesError,
  } = useQuery(['resources'], fetchResources)

  const { updateTab } = useContext(TabsContext)

  const { queryId: idFromParams } = useParams()
  const id = Number.parseInt(idFromParams, 10)
  const {
    isLoading: isLoadingSavedQuery,
    data: savedQuery,
    error: savedQueryError,
  } = useQuery(['saved-query', id], () => fetchSavedQuery(id), {
    onSettled: (dataFetched) => {
      if (dataFetched) {
        setQuery(dataFetched.query)
        setSelectedResourceId(dataFetched.resource?.id)
        setQueryName(dataFetched.name)
        updateTab({
          tabRoute,
          name: computeTabName(dataFetched.name),
        })
      }
    },
  })

  useUpdateTabOnQueryChange({
    tabRoute,
    query,
    originalQuery: savedQuery?.query,
    resource: selectedResourceId,
    originalResource: savedQuery?.resource?.id,
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

  const [updateQueryMutation, { isLoading: isUpdatingQuery }] = useMutation(
    updateQuery,
    {
      onSuccess: (updatedData) => {
        queryCache.setQueryData(['saved-queries', id], updatedData)
        queryCache.refetchQueries(['saved-queries'])
        updateTab({ tabRoute, unsavedState: false })
      },
      onError: (updationError) => {
        message.error((updationError as any).message)
        updateTab({
          tabRoute,
          name: savedQuery?.name ? computeTabName(savedQuery?.name) : undefined,
          unsavedState: true,
        })
      },
    },
  )

  function updateQueryData({
    updatedName,
    updatedQuery,
    updatedResource,
  }: {
    updatedName?: string
    updatedQuery?: string
    updatedResource?: number
  }) {
    updateQueryMutation({
      queryId: id,
      name: updatedName,
      query: updatedQuery,
      resource: updatedResource,
    })
  }

  const [measureContainer, containerBounds] = useMeasure()

  const editorAction = [
    {
      id: 'run-query',
      label: 'Run Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: (editor: monaco.editor.ICodeEditor) => {
        if (selectedResourceId) {
          runQueryMutation({
            resource: selectedResourceId,
            query: editor.getValue(),
          })
        }
      },
    },
    {
      id: 'save-query',
      label: 'Save Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      run: (editor: monaco.editor.ICodeEditor) => {
        if (selectedResourceId) {
          updateQueryData({
            updatedResource: selectedResourceId,
            updatedQuery: editor.getValue(),
          })
        }
      },
    },
    {
      id: 'beautify-query',
      label: 'Beautify Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B],
      run: () => {
        setQuery((prevQuery) =>
          sqlFormatter.format(prevQuery.replace(/\r\n/g, '\n')),
        )
      },
    },
  ]

  if (isLoadingResource || isLoadingSavedQuery) {
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

  if (resourcesError || savedQueryError) {
    return (
      <Result
        status="warning"
        subTitle={
          (resourcesError as any).message ?? (savedQueryError as any).message
        }
      />
    )
  }

  if (!selectedResourceId) {
    return (
      <>
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
        {createPortal(
          <Empty
            className="flex flex-col items-center justify-center h-full my-0"
            description={
              <span className="text-xs">
                Create a resource to view its schema
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />,
          document.getElementById('schema-container') as HTMLDivElement,
        )}
      </>
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
          {editQueryName ? (
            <Input
              className="flex-1"
              autoFocus
              value={queryName}
              onFocus={(event) => {
                event.target.select()
              }}
              onChange={({ target: { value } }) => {
                setQueryName(value)
              }}
              onPressEnter={() => {
                setEditQueryName(false)
                updateQueryData({ updatedName: queryName })
                updateTab({ tabRoute, name: computeTabName(queryName) })
              }}
              onBlur={() => {
                setEditQueryName(false)
                updateQueryData({ updatedName: queryName })
                updateTab({ tabRoute, name: computeTabName(queryName) })
              }}
            />
          ) : (
            <div
              className="flex-1 text-sm cursor-pointer text-content-primary"
              onClick={() => {
                setEditQueryName(true)
              }}
            >
              {queryName}
            </div>
          )}
          {queryResult?.timeToRunQuery ? (
            <div className="text-xs text-content-tertiary">
              Took{' '}
              <span className="font-medium text-content-primary">
                {formatDuration(queryResult.timeToRunQuery)}
              </span>{' '}
              to run
            </div>
          ) : null}
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            loading={isRunningQuery}
            disabled={isRunningQuery || !query}
            onClick={() => {
              if (selectedResourceId) {
                runQueryMutation({ resource: selectedResourceId, query })
              }
            }}
          >
            Run Query
          </Button>
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              setQuery((prevQuery) =>
                sqlFormatter.format(prevQuery.replace(/\r\n/g, '\n')),
              )
            }}
          >
            Beautify
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={() => {
              updateQueryData({
                updatedResource: selectedResourceId,
                updatedQuery: query,
              })
            }}
            loading={isUpdatingQuery}
            disabled={isUpdatingQuery}
          >
            Save
          </Button>
        </div>

        <div
          className={clsx(
            'flex flex-1',
            splitOrientation === SplitOrientation.HORIZONTAL
              ? 'flex-col'
              : undefined,
          )}
          ref={measureContainer}
        >
          {splitOrientation === SplitOrientation.VERTICAL ? (
            <HorizontalPane
              paneName="editor-horizontal-pane"
              initialWidth={640}
              maxConstraint={800}
              minConstraint={320}
              buffer={160}
              render={({
                paneWidth,
                isPaneClose,
                dragHandle,
                toggleFullScreen,
              }) => {
                const headerIcons = (
                  <div className="space-x-4">
                    <Tooltip
                      title="Split Horizontally"
                      placement="left"
                      mouseEnterDelay={1}
                    >
                      <button
                        className="focus:outline-none"
                        onClick={() => {
                          setSplitOrientation(SplitOrientation.HORIZONTAL)
                        }}
                      >
                        <BorderHorizontalOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Fullscreen"
                      placement="left"
                      mouseEnterDelay={1}
                    >
                      <button
                        className="focus:outline-none"
                        onClick={toggleFullScreen}
                      >
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
                        resourceId={selectedResourceId}
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
                        className="h-full px-4 py-1 queries-tab"
                        size="small"
                        tabBarExtraContent={headerIcons}
                      >
                        <Tabs.TabPane tab="Table" key="1">
                          <div className="h-full">
                            <ResultsTable
                              data={queryResult}
                              isLoading={isRunningQuery}
                              error={queryResultError}
                            />
                          </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Charts" key="2">
                          <Result
                            title="Under Construction"
                            subTitle="Sorry, the page doesn't exist. Come back later"
                          />
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </>
                )
              }}
            />
          ) : (
            <VerticalPane
              paneName="editor-vertical-pane"
              initialHeight={480}
              maxHeight={containerBounds.height}
              maxConstraint={containerBounds.height - 160}
              buffer={80}
              render={({
                paneHeight,
                isFullScreen,
                dragHandle,
                toggleFullScreen,
              }) => {
                const headerIcons = (
                  <div className="space-x-4">
                    <Tooltip
                      placement="left"
                      title="Split Vertically"
                      mouseEnterDelay={1}
                    >
                      <button
                        className="focus:outline-none"
                        onClick={() => {
                          setSplitOrientation(SplitOrientation.VERTICAL)
                        }}
                      >
                        <BorderVerticleOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip
                      placement="left"
                      title="Fullscreen"
                      mouseEnterDelay={1}
                    >
                      <button
                        className="focus:outline-none"
                        onClick={toggleFullScreen}
                      >
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
                          resourceId={selectedResourceId}
                          value={query}
                          setValue={setQuery}
                          editorAction={editorAction}
                        />
                      </div>
                    ) : null}
                    <div
                      className="relative border-t"
                      style={{ height: paneHeight }}
                    >
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
                              error={queryResultError}
                            />
                          </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Charts" key="2">
                          <Result
                            title="Under Construction"
                            subTitle="Sorry, the page doesn't exist. Come back later"
                          />
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </>
                )
              }}
            />
          )}
        </div>
      </div>
      {createPortal(
        <SchemaTab resourceId={selectedResourceId} />,
        document.getElementById('schema-container') as HTMLDivElement,
      )}
    </>
  )
}

export default function UnsavedQueryEditorTab() {
  const { pathname: tabRoute } = useLocation()

  return useMemo(() => <Tab key={tabRoute} />, [tabRoute])
}
