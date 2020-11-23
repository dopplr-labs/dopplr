import React, { cloneElement } from 'react'
import {
  BarChartOutlined,
  CodeOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

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
  {
    id: 'settings',
    title: 'Settings',
    icon: <SettingOutlined className="text-xl" />,
    defaultRoute: '/settings',
    routes: ['/settings'],
  },
]

export default function SideBar() {
  return (
    <div className="flex flex-col items-center justify-start w-24 h-full text-gray-400 bg-gray-800 border-r">
      {pages.map((page) => {
        return (
          <NavLink
            to={page.defaultRoute}
            key={page.id}
            className="flex flex-col items-center justify-center w-full py-3 cursor-pointer"
            activeClassName="bg-gray-700 border-l-2 border-blue-500 text-white"
          >
            {cloneElement(page.icon, { className: 'text-xl' })}
            <div className="text-xs">{page.title}</div>
          </NavLink>
        )
      })}
    </div>
  )
}
