import React from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, Route, Switch } from 'react-router-dom'
import { useQuery } from 'react-query'
import { fetchResources } from '../../queries/resourceQueries'
import Connectors from './components/connectors-list'
import NewConnection from './components/new-connection'

export default function Resources() {
  const { data: resources } = useQuery(['resources'], fetchResources)

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
        {resources?.map((resource: any) => (
          <div key={resource.id} className="cursor-pointer hover:text-blue-500">
            {resource.name}
          </div>
        ))}
      </div>
      <Switch>
        <Route path="/resources" exact component={Connectors} />
        <Route path="/resources/new/postgres" component={NewConnection} />
      </Switch>
    </div>
  )
}
