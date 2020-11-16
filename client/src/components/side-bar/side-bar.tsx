import React from 'react'
import {
  BarChartOutlined,
  CodeOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { Tooltip } from 'antd'

const pages = [
  {
    id: 'queries',
    title: 'Queries',
    icon: <CodeOutlined className="text-xl" />,
    defaultRoute: '/queries',
    routes: ['/queries'],
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: <DatabaseOutlined className="text-xl" />,
    defaultRoute: '/resources',
    routes: [
      '/resources',
      '/resources/:resourceId',
      '/resources/new/:resourceType',
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <BarChartOutlined className="text-xl" />,
    defaultRoute: '/dashboards',
    routes: ['/dashboards', '/dashboards/:dashboardId?'],
  },
]

export default function SideBar() {
  const location = useLocation()

  return (
    <div className="flex flex-col items-center justify-start w-16 h-full pt-4 shadow gap-y-4">
      {pages.map((page) => {
        const pageSelected = page.routes.some(
          (path) => !!matchPath(path, location.pathname),
        )
        return (
          <Link to={page.defaultRoute} key={page.id}>
            <PageIcon title={page.title} selected={pageSelected}>
              {page.icon}
            </PageIcon>
          </Link>
        )
      })}
    </div>
  )
}

function PageIcon({
  title,
  selected = false,
  children,
}: {
  title: string
  selected?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip title={title} placement="right">
      <button
        className={clsx(
          'flex rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none',
          selected
            ? 'bg-blue-50 text-blue-500'
            : 'hover:text-gray-700 hover:bg-gray-100',
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}
