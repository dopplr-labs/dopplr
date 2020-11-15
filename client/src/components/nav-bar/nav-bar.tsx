import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="relative z-10 h-12 shadow">
      <div className="flex items-center h-full px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={require('images/logo-transparent.svg')}
            alt="Dopplr"
            className="w-6 h-6"
          />
          <div className="text-base font-semibold text-gray-700">Dopplr</div>
        </Link>
        <div className="flex-1" />
      </div>
    </div>
  )
}
