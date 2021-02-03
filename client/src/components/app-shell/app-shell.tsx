import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideBar from 'components/side-bar'
import NavBar from 'components/nav-bar'
import { HotKeys } from 'react-hotkeys'
import { hotkeysHandler, keyMap } from 'utils/keyboard'

export default function AppShell() {
  const { pathname } = useLocation()

  return (
    <HotKeys
      className="h-screen"
      keyMap={keyMap}
      handlers={pathname.startsWith('/queries') ? hotkeysHandler : undefined}
    >
      <div className="flex flex-col w-full h-full overflow-hidden">
        <NavBar />
        <div className="flex flex-1 overflow-hidden bg-white">
          <SideBar />
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </HotKeys>
  )
}
