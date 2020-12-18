import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from 'components/side-bar'
import NavBar from 'components/nav-bar'

export default function AppShell() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <NavBar />
      <div className="flex flex-1 overflow-hidden bg-white">
        <SideBar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
