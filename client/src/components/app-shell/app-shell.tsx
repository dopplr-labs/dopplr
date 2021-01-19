import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from 'components/side-bar'
import NavBar from 'components/nav-bar'
import TabsProvider from 'components/tabs-provider'

export default function AppShell() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <NavBar />
      <div className="flex flex-1 overflow-hidden bg-white">
        <SideBar />
        <div className="flex-1 overflow-hidden">
          {/* @TODO Move TabsProvider to a proper wrapper component */}
          <TabsProvider>
            <Outlet />
          </TabsProvider>
        </div>
      </div>
    </div>
  )
}
