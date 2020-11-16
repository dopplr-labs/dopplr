import { Result } from 'antd'
import clsx from 'clsx'
import { fetchResources } from 'pages/resources/queries'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import useMeasure from 'react-use-measure'
import QueryEditor from './query-editor'
import SchemaTab from './schema-tab'

type QueryTabProps = {
  width: number
  className?: string
  style?: React.CSSProperties
}

export default function QueryTab({ width, className, style }: QueryTabProps) {
  const [selectedResource, setSelectedResource] = useState<number>()
  const [measureSchemaTab, schemaTabBounds] = useMeasure()

  const { isLoading, data: resources, error } = useQuery(
    ['resources'],
    fetchResources,
    {
      onSettled: (data) => {
        if (data && data.length > 0) {
          setSelectedResource(data[0].id)
        }
      },
    },
  )

  if (isLoading) {
    return (
      <div
        className={clsx('flex h-full px-4 space-x-4', className)}
        style={style}
      >
        <div className="flex-1 py-4 space-y-4">
          <div className="w-full bg-gray-200 rounded-md h-80 animate-pulse" />
          <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="py-4 space-y-4 w-80">
          <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="warning"
        subTitle={(error as any).message}
        className={className}
        style={style}
      />
    )
  }

  if (resources && selectedResource) {
    return (
      <div className={clsx('flex h-full', className)} style={style}>
        {schemaTabBounds.width ? (
          <QueryEditor
            className="flex-1"
            editorWidth={width - schemaTabBounds.width}
            resources={resources}
            selectedResource={selectedResource}
            onResourceChange={setSelectedResource}
          />
        ) : null}

        <div
          ref={measureSchemaTab}
          className="flex-shrink-0 h-full py-4 border-l border-gray-200 w-80"
        >
          <SchemaTab resourceId={selectedResource} />
        </div>
      </div>
    )
  }

  return null
}
