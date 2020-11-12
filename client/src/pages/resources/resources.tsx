import React, { useMemo } from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query'
import { range } from 'lodash-es'
import { Postgres } from 'components/icons'
import { fetchResources } from './queries'
import ResourcesList from './components/resources-list'
import CreateResource from './components/create-resource'
import ResourceForm from './components/resource-form'

export default function Resources() {
  const { pathname } = useLocation()

  const { data: resources, isLoading, error } = useQuery(
    ['resources'],
    fetchResources,
    {
      onSuccess: (data) => {
        data.forEach((resource) => {
          queryCache.setQueryData(
            ['resources', resource.id.toString()],
            resource,
          )
        })
      },
    },
  )

  const resourcesList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {range(5).map((val) => (
            <div
              key={val}
              className="w-full h-4 bg-gray-200 rounded animate-pulse"
              style={{ opacity: 1 - val / 5 }}
            />
          ))}
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (resources) {
      return (
        <div className="space-y-4">
          {resources?.map((resource) => (
            <Link
              to={`/resources/${resource.id}`}
              key={resource.id}
              className="flex items-center space-x-2 text-sm text-gray-800 cursor-pointer hover:text-blue-500"
            >
              {resource.type === 'postgres' ? (
                <Postgres className="w-5 h-5" />
              ) : null}
              <span>{resource.name}</span>
            </Link>
          ))}
        </div>
      )
    }

    return null
  }, [resources, isLoading, error])

  return (
    <div className="flex flex-1 h-full">
      <div className="flex flex-col w-64 h-full p-4 text-gray-800 border-r">
        <div className="flex items-center mb-2 space-x-2">
          <DatabaseOutlined className="text-lg" />
          <span className="font-semibold">Resources</span>
        </div>
        <div className="mb-4 text-xs text-gray-600">
          Connect with your preferred database and fetch data to render in
          Tables
        </div>

        {pathname !== '/resources' ? (
          <Link to="/resources" className="block mb-4">
            <Button icon={<PlusOutlined />} className="w-full" type="primary">
              Create New
            </Button>
          </Link>
        ) : null}

        <div className="mb-4 -mx-4 border-b" />

        {resourcesList}
      </div>

      <Routes>
        <Route path="/" element={<ResourcesList />} />
        <Route path="new/:resourceType" element={<CreateResource />} />
        <Route path=":resourceId" element={<ResourceForm />} />
      </Routes>
    </div>
  )
}
