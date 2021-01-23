import { CaretRightFilled } from '@ant-design/icons'
import { Button } from 'antd'
import Editor from 'components/editor'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { QueryResult } from 'types/query'
import { useTabData } from '../hooks/use-tab-data'
import { runQuery } from '../queries-and-mutations'
import CreateResourceMessage from './create-resource-message'
import QueryEditorSkeleton from './query-editor-skeleton'
import ResourceSelector from './resource-selector'

export default function QueryEditor() {
  const { tabType, id } = useParams()
  const tabRoute = `${tabType}/${id}`

  const {
    isLoadingTabData,
    resourceId,
    updateResourceId,
    query,
    updateQuery,
  } = useTabData(tabRoute)

  const [, setQueryResult] = useState<QueryResult | undefined>(undefined)
  const queryClient = useQueryClient()
  const { mutate: runQueryMutation, isLoading: isRunningQuery } = useMutation(
    runQuery,
    {
      onSuccess: (runQueryResult) => {
        queryClient.refetchQueries(['history'])
        setQueryResult(runQueryResult)
      },
    },
  )

  if (isLoadingTabData) {
    return <QueryEditorSkeleton />
  }

  if (!resourceId) {
    return <CreateResourceMessage />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 space-x-3 border-b">
        <ResourceSelector resource={resourceId} onChange={updateResourceId} />
        <div className="flex-1" />
        <Button
          type="primary"
          icon={<CaretRightFilled />}
          loading={isRunningQuery}
          disabled={isRunningQuery || !query}
          onClick={() => {
            runQueryMutation({ resource: resourceId, query })
          }}
        >
          Run Query
        </Button>
      </div>
      <Editor resourceId={resourceId} value={query} setValue={updateQuery} />
    </div>
  )
}
