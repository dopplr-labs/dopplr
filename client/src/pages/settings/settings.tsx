import React from 'react'
import { Input } from 'antd'

const { Search } = Input

const onSearch = (value: string): void => console.log(value)

export default function Settings() {
  return (
    <div className="flex flex-1 h-full justify-center bg-gray-200">
      <div className="flex flex-col xl:w-1/2 w-96 my-4 shadow-lg">
        <div className="mx-2 mt-2">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="flex flex-1 mx-2 mt-2 mb-2">
          <div className="w-56 hidden xl:block bg-gray-200">Heading</div>
          <div className="flex-1 overflow-y-scroll bg-gray-300">Actual settings</div>
        </div>
      </div>
    </div>
  )
}
