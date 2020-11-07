import React from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, Route, Switch } from 'react-router-dom'
import Connectors from './components/connectors-list'
import NewConnection from './components/new-connection'

const connectedResources = [
  {
    id: '101',
    title: 'Project DB',
  },
  {
    id: '102',
    title: 'Users database',
  },
  {
    id: '103',
    title: 'Billing DB',
  },
]

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
        {connectedResources.map((resource) => (
          <div key={resource.id} className="cursor-pointer hover:text-blue-500">
            {resource.title}
          </div>
        ))}
      </div>
      <Switch>
        <Route path="/resources" exact component={Connectors} />
        <Route path="/resources/new" component={NewConnection} />
      </Switch>
    </div>
  )
}
