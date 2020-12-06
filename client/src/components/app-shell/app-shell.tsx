import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from 'components/side-bar'

export default function AppShell() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="relative z-10 flex items-center h-12 px-8 bg-gray-800">
        <img
          src={require('images/logo-transparent.svg')}
          alt="Dopplr"
          className="w-8 h-8 mr-2"
        />
        <div className="text-base font-bold text-white">Dopplr</div>
      </div>
      <div className="flex flex-1 overflow-hidden bg-white">
        <SideBar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
