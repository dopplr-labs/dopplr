import React, { useContext } from 'react'
import { Button, Tabs, Tooltip } from 'antd'
import {
  CaretRightFilled,
  CodeOutlined,
  WarningFilled,
} from '@ant-design/icons'
import { useMutation, useQueryClient } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import useMeasure from 'react-use-measure'
import clsx from 'clsx'
import { QueryResult } from 'types/query'
import { Cache } from 'utils/cache'
import Editor from 'components/editor'
import EditorContext from 'contexts/editor-context'
import usePersistedSetState from 'hooks/use-persisted-state'
import { formatDuration } from 'utils/time'
import sqlFormatter from 'sql-formatter'
import SettingsContext from 'contexts/settings-context'
import { aceCommands, KeyboardActions, keyMap } from 'utils/keyboard'
import { useTabData } from '../hooks/use-tab-data'
import { runQuery } from '../queries-and-mutations'
import CreateResourceMessage from './create-resource-message'
import QueryEditorSkeleton from './query-editor-skeleton'
import ResourceSelector from './resource-selector'
import HorizontalOrientation from './horizontal-orientation'
import VerticalOrientation from './vertical-orientation'
import ResultsTable from './results-table'
import { TabType } from '../types'
import SaveQueryButton from './save-query-button'
import UpdateQueryButton from './update-query-button'
import QueryName from './query-name'
import ChartTab from './chart-tab'
import KeyboardIcons from './keyboard-icons'

const runResultCache = new Cache()

enum PaneOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export default function QueryEditor() {
  const { tabType, id } = useParams()
  const tabRoute = `${tabType}/${id}`

  const { textEditorSettings } = useContext(SettingsContext)

  const {
    isLoadingTabData,
    resourceId,
    updateResourceId,
    query,
    updateQuery,
    name,
  } = useTabData(tabRoute)

  const [measureContainer, containerBounds] = useMeasure()
  const [
    paneOrientation,
    setPaneOrientation,
  ] = usePersistedSetState<PaneOrientation>(
    'query-editor-orientation',
    PaneOrientation.VERTICAL,
  )

  const queryClient = useQueryClient()
  const {
    mutate: runQueryMutation,
    isLoading: isRunningQuery,
    error: queryResultError,
  } = useMutation(runQuery, {
    onSuccess: (runQueryResult) => {
      queryClient.refetchQueries(['history'])
      setQueryResult(runQueryResult)
    },
  })
  const [queryResult, setQueryResult] = usePersistedSetState<
    QueryResult | undefined
  >(`${tabRoute}-query-result`, undefined, runResultCache)

  const [searchParams, setSearchParams] = useSearchParams({ tab: 'result' })

  if (isLoadingTabData) {
    return <QueryEditorSkeleton />
  }

  if (!resourceId) {
    return <CreateResourceMessage />
  }

  const PaneOrientationComponent =
    paneOrientation === PaneOrientation.HORIZONTAL
      ? HorizontalOrientation
      : VerticalOrientation

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 space-x-3 border-b">
        <ResourceSelector resource={resourceId} onChange={updateResourceId} />
        {tabType === TabType.SAVED ? (
          <>
            {/* Move the logic of converting id to number into a common utility */}
            <QueryName savedQueryId={Number.parseInt(id, 10)} />
          </>
        ) : (
          <div className="flex-1" />
        )}
        {queryResult?.maxLimitEnforced ? (
          <div className="flex items-center px-2 space-x-2 text-xs border-r text-content-tertiary">
            <WarningFilled className="text-lg text-yellow-300" />
            <span>Query limited to max {queryResult.numRows} rows</span>
          </div>
        ) : null}
        {queryResult?.timeToRunQuery ? (
          <div className="text-xs text-content-tertiary">
            Took{' '}
            <span className="font-medium text-content-primary">
              {formatDuration(queryResult.timeToRunQuery)}
            </span>{' '}
            to run
          </div>
        ) : null}
        <Tooltip
          title={<KeyboardIcons command={keyMap[KeyboardActions.RUN_QUERY]} />}
          placement="bottom"
          destroyTooltipOnHide
        >
          <Button
            type="primary"
            icon={<CaretRightFilled />}
            loading={isRunningQuery}
            disabled={isRunningQuery || !query}
            onClick={() => {
              runQueryMutation({ resource: resourceId, query })
            }}
            id="run-query-button"
          >
            Run Query
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <KeyboardIcons command={keyMap[KeyboardActions.FORMAT_QUERY]} />
          }
          placement="bottom"
          destroyTooltipOnHide
        >
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              updateQuery(
                sqlFormatter.format(query.replace(/\r\n/g, '\n'), {
                  indent: Array.from({
                    length: textEditorSettings.tabSize as number,
                  })
                    .fill(' ')
                    .join(''),
                }),
              )
            }}
            disabled={!query}
            id="format-query-button"
          >
            Format
          </Button>
        </Tooltip>
        <Tooltip
          title={<KeyboardIcons command={keyMap[KeyboardActions.SAVE_QUERY]} />}
          placement="bottomRight"
          destroyTooltipOnHide
        >
          <span>
            {tabType !== TabType.SAVED ? (
              <SaveQueryButton
                query={query}
                resourceId={resourceId}
                disabled={!query}
              />
            ) : (
              <>
                {/* Move the logic of converting id to number into a common utility */}
                <UpdateQueryButton savedQueryId={Number.parseInt(id, 10)} />
              </>
            )}
          </span>
        </Tooltip>
      </div>
      <div
        className={clsx(
          'flex flex-1',
          paneOrientation === PaneOrientation.HORIZONTAL
            ? 'flex-col'
            : undefined,
        )}
        ref={measureContainer}
      >
        <PaneOrientationComponent
          toggleOrientation={() => {
            setPaneOrientation((prevState) =>
              prevState === PaneOrientation.HORIZONTAL
                ? PaneOrientation.VERTICAL
                : PaneOrientation.HORIZONTAL,
            )
          }}
          containerBounds={containerBounds}
          editor={
            <Editor
              resourceId={resourceId}
              value={query}
              setValue={updateQuery}
              commands={aceCommands}
            />
          }
          tabContent={(headerIcons) => (
            <Tabs
              activeKey={searchParams.get('tab') ?? undefined}
              onChange={(tabKey) => {
                setSearchParams({ tab: tabKey })
              }}
              size="small"
              className="w-full h-full px-4 py-1 queries-tab"
              tabBarExtraContent={headerIcons}
              destroyInactiveTabPane
            >
              <Tabs.TabPane tab="Table" key="result">
                <div className="w-full h-full">
                  <ResultsTable
                    fileName={name}
                    query={query}
                    resourceId={resourceId as number}
                    data={queryResult}
                    isLoading={isRunningQuery}
                    error={queryResultError}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Charts" key="chart">
                <EditorContext.Provider
                  value={{
                    isSaved: tabType === TabType.SAVED,
                    queryId: id,
                    queryResult,
                  }}
                >
                  <ChartTab />
                </EditorContext.Provider>
              </Tabs.TabPane>
            </Tabs>
          )}
        />
      </div>
    </div>
  )
}
