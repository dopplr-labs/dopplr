import { Result } from 'antd'
import Select from 'antd/lib/select'
import { fetchResources } from 'pages/resources/queries'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import QueryEditor from './query-editor'
import SchemaTab from './schema-tab'

export default function QueryTab() {
  const [selectedResource, setSelectedResource] = useState<number>()

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
      <div className="flex h-full px-4 space-x-4">
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
    return <Result status="warning" subTitle={(error as any).message} />
  }

  if (resources && selectedResource) {
    return (
      <div className="flex h-full">
        <QueryEditor resourceId={selectedResource} className="flex-1" />
        <div className="border-l border-gray-200 w-80">
          <div className="px-3 py-4">
            <Select
              placeholder="Select a resource"
              className="w-full"
              value={selectedResource}
              onChange={(value: number) => {
                setSelectedResource(value)
              }}
            >
              {resources?.map((resource) => (
                <Select.Option key={resource.id} value={resource.id}>
                  {resource.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <SchemaTab resourceId={selectedResource} />
        </div>
      </div>
    )
  }

  return null
}
