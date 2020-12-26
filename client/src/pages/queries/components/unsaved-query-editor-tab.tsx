import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, queryCache, useQuery } from 'react-query'
import { Button, Empty, Result, Select } from 'antd'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import useMeasure from 'react-use-measure'
import sqlFormatter from 'sql-formatter'
import { QueryResult, SavedQuery } from 'types/query'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchResources } from 'pages/resources/queries'
import usePersistedSetState from 'hooks/use-persisted-state'
import { createPortal } from 'react-dom'
import { runQuery } from '../queries-and-mutations'
import SaveQueryModal from './save-query-modal'
import { TabsContext } from '../contexts/tabs-context'
import SchemaTab from './schema-tab'
import VerticalOrientation from './vertical-orientation'
import HorizontalOrientation from './horizontal-orientation'

enum SplitOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

function useUpdateTabOnQueryChange({
  tabRoute,
  query,
}: {
  tabRoute: string
  query: string
}) {
  const { updateTab } = useContext(TabsContext)

  useEffect(
    function updateTabOnQueryChange() {
      const tabName = query.length > 15 ? `${query.slice(0, 12)}...` : query
      const unsavedState = !!query
      updateTab({ tabRoute, name: tabName, unsavedState })
    },
    [query, tabRoute, updateTab],
  )
}

function Tab() {
  const { pathname: tabRoute } = useLocation()

  const [splitOrientation, setSplitOrientation] = usePersistedSetState<string>(
    'split-orientation',
    SplitOrientation.HORIZONTAL,
  )

  const [query, setQuery] = usePersistedSetState(`${tabRoute}-query`, '')
  useUpdateTabOnQueryChange({ tabRoute, query })

  const [selectedResourceId, setSelectedResourceId] = usePersistedSetState<
    number | null
  >(`${tabRoute}-resource`, null)
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

  function handleHorizontalSplit() {
    setSplitOrientation(SplitOrientation.HORIZONTAL)
  }

  function handleVerticalSplit() {
    setSplitOrientation(SplitOrientation.VERTICAL)
  }

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
      run: () => {
        setSaveModalVisible(true)
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

  if (isLoadingResource) {
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

  if (resourcesError) {
    return (
      <Result status="warning" subTitle={(resourcesError as any).message} />
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
            <VerticalOrientation
              handleHorizontalSplit={handleHorizontalSplit}
              resourceId={selectedResourceId}
              query={query}
              setQuery={setQuery}
              editorAction={editorAction}
              containerBounds={containerBounds}
              queryResult={queryResult}
              isRunningQuery={isRunningQuery}
              error={queryResultError}
            />
          ) : (
            <HorizontalOrientation
              handleVerticalSplit={handleVerticalSplit}
              resourceId={selectedResourceId}
              query={query}
              setQuery={setQuery}
              editorAction={editorAction}
              containerBounds={containerBounds}
              queryResult={queryResult}
              isRunningQuery={isRunningQuery}
              error={queryResultError}
            />
          )}
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
