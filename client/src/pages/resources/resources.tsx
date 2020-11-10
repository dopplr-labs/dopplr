import React from 'react'
import { DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, Route, Switch } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Postgres } from 'components/icons'
import { fetchResources } from './queries'
import Connectors from './components/connectors-list'
import NewConnection from './components/new-connection'

export default function Resources() {
  const { data: resources } = useQuery(['resources'], fetchResources)

  return (
    <div className="flex flex-1 h-full">
      <div className="flex flex-col w-64 h-full p-4 text-gray-800 border-r">
        <div className="flex items-center mb-2 space-x-2">
          <DatabaseOutlined className="text-lg" />
          <span className="font-semibold">Resources</span>
        </div>
        <div className="mb-4 text-xs text-gray-600">
          Connect with your preferred database and fetch data to render in
          Tables
        </div>
        <Link to="/resources" className="block mb-4">
          <Button icon={<PlusOutlined />} className="w-full" type="primary">
            Create New
          </Button>
        </Link>

        <div className="mb-4 -mx-4 border-b" />

        <div className="space-y-4">
          {resources?.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center space-x-2 text-sm text-gray-800 cursor-pointer hover:text-blue-500"
            >
              {resource.type === 'postgres' ? (
                <Postgres className="w-5 h-5" />
              ) : null}
              <span>{resource.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Switch>
        <Route path="/resources" exact component={Connectors} />
        <Route path="/resources/new/postgres" component={NewConnection} />
      </Switch>
    </div>
  )
}
