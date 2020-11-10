import React from 'react'

export default function Navbar() {
  return (
    <div className="relative z-10 shadow h-14">
      <div className="flex items-center h-full px-4 mx-auto">
        <img
          src={require('images/logo-transparent.svg')}
          alt="Dopplr"
          className="w-8 h-8 mr-2"
        />
        <div className="text-lg font-semibold text-gray-700">Dopplr</div>
        <div className="flex-1" />
      </div>
    </div>
  )
}
