import Editor from 'components/editor'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useTabData } from '../hooks/use-tab-data'
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
      </div>
      <Editor resourceId={resourceId} value={query} setValue={updateQuery} />
    </div>
  )
}
