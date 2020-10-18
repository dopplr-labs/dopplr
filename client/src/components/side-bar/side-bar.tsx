import React from 'react'
import {
  BarChartOutlined,
  CodeOutlined,
  TableOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import { Link, matchPath, useLocation } from 'react-router-dom'

const pages = [
  {
    id: 'dashboard',
    icon: <BarChartOutlined className="text-xl" />,
    defaultRoute: '/dashboards',
    route: '/dashboards/:dashboardId?',
  },
  {
    id: 'queries',
    icon: <CodeOutlined className="text-xl" />,
    defaultRoute: '/queries',
    route: '/queries/:queriesId?',
  },
  {
    id: 'tables',
    icon: <TableOutlined className="text-xl" />,
    defaultRoute: '/tables',
    route: '/tables/:tablesId?',
  },
  {
    id: 'resources',
    icon: <DatabaseOutlined className="text-xl" />,
    defaultRoute: '/resources',
    route: '/resources/:routeId?',
  },
]

export default function SideBar() {
  const location = useLocation()

  return (
    <div className="flex flex-col items-center justify-start w-16 h-full pt-4 shadow gap-y-4">
      {pages.map((page) => (
        <Link to={page.defaultRoute} key={page.id}>
          <PageIcon
            selected={
              !!matchPath(location.pathname, {
                path: page.route,
                exact: true,
                strict: false,
              })
            }
          >
            {page.icon}
          </PageIcon>
        </Link>
      ))}
    </div>
  )
}

function PageIcon({
  selected = false,
  children,
}: {
  selected?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      className={clsx(
        'flex rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none',
        selected
          ? 'bg-blue-500 text-white'
          : 'hover:text-gray-700 hover:bg-gray-100',
      )}
    >
      {children}
    </button>
  )
}
