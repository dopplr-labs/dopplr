import Editor from 'components/editor'
import React from 'react'
import ResourceSelector from './resource-selector'

type QueryEditorProps = {
  resource: number
  updateResource: (resource: number) => void
  query: string
  updateQuery: (query: string) => void
}

export default function QueryEditor({
  resource,
  updateResource,
  query,
  updateQuery,
}: QueryEditorProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 space-x-3 border-b">
        <ResourceSelector resource={resource} onChange={updateResource} />
      </div>
      <Editor resourceId={resource} value={query} setValue={updateQuery} />
    </div>
  )
}
