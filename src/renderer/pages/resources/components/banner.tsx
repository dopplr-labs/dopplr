import React from 'react'
import { DatabaseSolid } from '@tail-kit/tail-kit'

export default function Banner() {
  return (
    <div className="flex items-start p-4 space-x-2 bg-gray-200">
      <DatabaseSolid className="w-6 h-6" />
      <div>
        <p className="text-sm font-bold text-gray-800">Resources</p>
        <p className="text-xs text-gray-600">
          Connect with your preferred database and fetch data to render in
          Tables
        </p>
      </div>
    </div>
  )
}
