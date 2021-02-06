import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HotKeys } from 'react-hotkeys'
import SideBar from 'components/side-bar'
import NavBar from 'components/nav-bar'
import { hotkeysHandler, keyMap } from 'utils/keyboard'
import Settings from 'components/settings'

export default function AppShell() {
  const { pathname } = useLocation()
  const isQueriesPage = pathname.startsWith('/queries')

  return (
    <Settings>
      <HotKeys
        className="h-screen"
        keyMap={isQueriesPage ? keyMap : undefined}
        handlers={isQueriesPage ? hotkeysHandler : undefined}
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
    </Settings>
  )
}
