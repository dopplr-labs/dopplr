import React from 'react'

export default function Navbar() {
  return (
    <div className="relative z-10 h-12 shadow">
      <div className="flex items-center h-full px-4 mx-auto">
        <img
          src={require('images/logo-transparent.svg')}
          alt="Dopplr"
          className="w-6 h-6 mr-2"
        />
        <div className="text-base font-semibold text-gray-700">Dopplr</div>
        <div className="flex-1" />
      </div>
    </div>
  )
}
