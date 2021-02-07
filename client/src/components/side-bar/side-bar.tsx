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
    id: 'dashboard',
    title: 'Dashboard',
    icon: <BarChartOutlined />,
    defaultRoute: '/dashboards',
    routes: ['/dashboards', '/dashboards/:dashboardId?'],
  },
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
    id: 'settings',
    title: 'Settings',
    icon: <SettingOutlined className="text-xl" />,
    defaultRoute: '/settings',
    routes: ['/settings'],
  },
]

export default function SideBar() {
  return (
    <div className="flex flex-col items-center justify-start h-full p-2 space-y-2 border-r bg-background-primary text-content-secondary">
      {pages.map((page) => {
        return (
          <NavLink
            to={page.defaultRoute}
            key={page.id}
            className="flex flex-col items-center justify-center w-24 py-2 space-y-1 font-medium rounded-md"
            activeClassName="bg-brand-primary text-white hover:text-white"
          >
            {cloneElement(page.icon, { className: 'text-xl' })}
            <div className="text-xs">{page.title}</div>
          </NavLink>
        )
      })}
    </div>
  )
}
