import React from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import Connectors from './components/connectors-list'

export default function Resources() {
  return (
    <div className="flex flex-1 h-full">
      <div className="flex flex-col w-64 h-full p-6 space-y-3 border-r">
        <div className="flex items-center space-x-2">
          <DatabaseOutlined className="text-lg" />
          <span className="font-semibold">Connections</span>
        </div>
        <Link to="/resources">
          <Button type="primary" icon={<PlusOutlined />} className="w-full">
            Create New
          </Button>
        </Link>
      </div>
      <Connectors />
    </div>
  )
}
