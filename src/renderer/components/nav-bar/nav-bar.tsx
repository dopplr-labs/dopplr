import React from 'react'
import { BellFilled } from '@ant-design/icons'

export default function Navbar() {
  return (
    <div className="relative z-10 h-12 bg-gray-900 shadow-md">
      <div className="flex items-center h-full px-4 mx-auto">
        <img
          src={require('../../images/logo-transparent.svg')}
          alt="Dopplr"
          className="w-8 h-8 mr-2"
        />
        <div className="font-medium text-white">Dopplr</div>
        <div className="flex-1" />
        <span className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full cursor-pointer">
          <BellFilled className="text-base text-white" />
        </span>
      </div>
    </div>
  )
}
