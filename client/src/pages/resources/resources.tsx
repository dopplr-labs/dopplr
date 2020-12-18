import React, { useMemo } from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query'
import { range } from 'lodash-es'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import PageSideBarLink from 'components/page-side-bar-link'
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
        <>
          {range(5).map((val) => (
            <div key={val} className="px-4 py-1">
              <div
                className="w-full h-4 bg-background-secondary animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
            </div>
          ))}
        </>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (resources) {
      return (
        <>
          {resources?.map((resource) => (
            <PageSideBarLink
              to={`/resources/${resource.id}`}
              key={resource.id}
              badge={resource.type}
            >
              {resource.name}
            </PageSideBarLink>
          ))}
        </>
      )
    }

    return null
  }, [resources, isLoading, error])

  return (
    <PageLayout
      sidebar={
        <PageSideBar
          icon={<DatabaseOutlined className="text-lg" />}
          title="Resources"
          description="Connect with your preferred database and fetch data to render in Tables"
          primaryAction={
            pathname !== '/resources' ? (
              <Link to="/resources" className="block mt-4">
                <Button
                  icon={<PlusOutlined />}
                  className="w-full"
                  type="primary"
                >
                  Create New
                </Button>
              </Link>
            ) : undefined
          }
          items={resourcesList}
        />
      }
      content={<Outlet />}
    />
  )
}
