import React, { useMemo } from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query'
import { range } from 'lodash-es'
import { Postgres } from 'components/icons'
import { fetchResources } from './queries'

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
              className="w-full h-4 bg-gray-200 animate-pulse"
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
        <div className="space-y-2">
          {resources?.map((resource) => (
            <Link
              to={`/resources/${resource.id}`}
              key={resource.id}
              className="flex items-center space-x-2 text-sm cursor-pointer hover:text-blue-500"
            >
              {resource.type === 'postgres' ? (
                <Postgres className="w-6 h-6" />
              ) : null}
              <span className="text-xs">{resource.name}</span>
            </Link>
          ))}
        </div>
      )
    }

    return null
  }, [resources, isLoading, error])

  return (
    <div className="flex flex-1 h-full">
      <div className="flex flex-col w-64 h-full p-4 border-r">
        <div className="flex items-center mb-2 space-x-2">
          <DatabaseOutlined className="text-lg" />
          <span className="font-medium text-gray-800">Resources</span>
        </div>
        <div className="mb-4 text-xs">
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

      <Outlet />
    </div>
  )
}
