import React from 'react'
import {
  ChevronDownSolid,
  SearchSolid,
  Button,
  DownloadSolid,
  Input,
} from '@tail-kit/tail-kit'
import { UnControlled as CodeMirror } from 'react-codemirror2'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/ayu-mirage.css')
require('codemirror/mode/sql/sql')

export default function Queries() {
  return (
    <div className="flex flex-1 h-full">
      <div className="w-64 h-full border-r">
        <div className="flex items-center justify-between px-6 my-4 text-xs font-medium text-gray-600">
          <span className="px-2 py-1 text-blue-700 bg-blue-100 rounded-md">
            Resource
          </span>
          <span>History</span>
          <span>Saved</span>
        </div>
        <div className="px-6 space-y-4">
          <div className="flex items-center justify-between px-3 py-1 text-xs text-gray-400 border rounded-md focus-within:shadow-outline">
            <input
              className="w-full focus:outline-none"
              placeholder="Select Resource"
            />
            <ChevronDownSolid className="w-5 h-5" />
          </div>
          <div className="flex items-center px-3 py-1 space-x-1 text-gray-400 border rounded-md focus-within:shadow-outline">
            <SearchSolid className="w-5 h-5" />
            <input
              className="w-full text-xs focus:outline-none"
              placeholder="Search tables and columns"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        {/* Query Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-sm">Untitled query</span>
          <div className="flex items-center space-x-4">
            {/* Remove css prop after fixing the issue */}
            <Button label="Save" />
            {/* Remove css prop after fixing the issue */}
            <Button buttonType={Button.ButtonType.primary} label="Run Query" />
          </div>
        </div>
        {/* Query editor */}
        <div className="border-b ">
          <CodeMirror
            value="SELECT * FROM superstar WHERE age > 20;"
            options={{ mode: 'sql', theme: 'ayu-mirage', lineNumbers: true }}
          />
        </div>
        <div className="flex-1 px-6 py-4 border-b ">
          <div className="flex flex-row-reverse gap-x-4">
            {/* Remove css prop after fixing the issue */}
            <Button label="Download" icon={<DownloadSolid />} />
            {/* Remove css prop after fixing the issue */}
            <Input placeholder="Search Table" icon={<SearchSolid />} />
          </div>
        </div>
      </div>
    </div>
  )
}
