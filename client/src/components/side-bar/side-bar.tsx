import React, { cloneElement } from 'react'
import {
  BarChartOutlined,
  CodeOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import { Link, matchPath, useLocation } from 'react-router-dom'

const pages = [
  {
    id: 'queries',
    title: 'Queries',
    icon: <CodeOutlined />,
    defaultRoute: '/queries',
    routes: ['/queries'],
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: <DatabaseOutlined />,
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
    icon: <BarChartOutlined />,
    defaultRoute: '/dashboards',
    routes: ['/dashboards', '/dashboards/:dashboardId?'],
  },
]

export default function SideBar() {
  const location = useLocation()

  return (
    <div className="flex flex-col items-center justify-start w-24 h-full bg-gray-800 border-r">
      {pages.map((page) => {
        const pageSelected = page.routes.some(
          (path) => !!matchPath(path, location.pathname),
        )
        return (
          <Link to={page.defaultRoute} key={page.id} className="w-full">
            <div
              className={clsx(
                'flex flex-col items-center justify-center w-full py-3 cursor-pointer',
                pageSelected
                  ? 'bg-gray-700 text-white border-l-2 border-blue-500'
                  : 'text-gray-400',
              )}
            >
              {cloneElement(page.icon, { className: 'text-xl' })}
              <div className="text-xs">{page.title}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
