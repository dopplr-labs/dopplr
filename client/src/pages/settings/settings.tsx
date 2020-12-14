import React from 'react'
import { Menu } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import { Outlet, Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

export default function Settings() {
  const path = useLocation()
  console.log(path.pathname);
  return (
    <div className="flex flex-1 h-full">
      <div className="w-64 h-full border-r">
        <Scrollbars className="h-full" autoHide universal>
          <Menu
            mode="inline"
            defaultSelectedKeys={[path.pathname]}
          >
            <Menu.Item key="/settings/textEditor">
              <Link to="textEditor">Text Editor</Link>
            </Menu.Item>
            <Menu.Item key="/settings/workbench">
              <Link to="workbench">Workbench</Link>
            </Menu.Item>
          </Menu>
        </Scrollbars>
      </div>

      <div className="flex-1">
        <Scrollbars className="h-full" autoHide universal>
          <Outlet />
        </Scrollbars>
      </div>
    </div>
  )
}
