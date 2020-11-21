import { Result } from 'antd'
import clsx from 'clsx'
import { fetchResources } from 'pages/resources/queries'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import useMeasure from 'react-use-measure'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import QueryEditor from './query-editor'
import SchemaTab from './schema-tab'

type QueryTabProps = {
  queryName: string
  width: number
  handleKeyIncrement: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  style?: React.CSSProperties
}

export default function QueryTab({
  queryName,
  width,
  handleKeyIncrement,
  onChange,
  className,
  style,
}: QueryTabProps) {
  const [measureContainer, containerBounds] = useMeasure()
  const [schemaContainerWidth, setSchemaContainerWidth] = useState(320)

  const [selectedResource, setSelectedResource] = useState<number>()

  const { isLoading, data: resources, error } = useQuery(
    ['resources'],
    fetchResources,
    {
      onSettled: (data) => {
        if (data && data.length > 0 && !selectedResource) {
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
      <div
        className={clsx('flex h-full', className)}
        style={style}
        ref={measureContainer}
      >
        <QueryEditor
          className="flex-1"
          editorWidth={width - schemaContainerWidth}
          handleKeyIncrement={handleKeyIncrement}
          resources={resources}
          queryName={queryName}
          onChange={onChange}
          selectedResource={selectedResource}
          onResourceChange={setSelectedResource}
        />

        <ResizableBox
          className="relative flex-shrink-0 h-full py-4 border-gray-100"
          axis="x"
          width={schemaContainerWidth}
          resizeHandles={['w']}
          handle={() => (
            <div className="absolute top-0 left-0 w-px h-full bg-gray-200 col-resize-handle" />
          )}
          height={containerBounds.height}
          minConstraints={[240, containerBounds.height]}
          maxConstraints={[480, containerBounds.height]}
          onResize={(event, { size: { width } }) => {
            setSchemaContainerWidth(width)
          }}
        >
          <SchemaTab resourceId={selectedResource} />
        </ResizableBox>
      </div>
    )
  }

  return null
}
