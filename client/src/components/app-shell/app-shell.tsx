import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from 'components/side-bar'
import Navbar from 'components/nav-bar/nav-bar'

export default function AppShell() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-white">
        <SideBar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
