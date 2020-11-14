import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Input, Select, Spin, Tabs, Button, Empty } from 'antd'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { Scrollbars } from 'react-custom-scrollbars'
import { fetchResources } from 'pages/resources/queries'
import ResourceTab from './components/resource-tab'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/ayu-mirage.css')
require('codemirror/mode/sql/sql')

export default function Queries() {
  const { Option } = Select

  const { isLoading, data: resources } = useQuery(['resources'], fetchResources)
  const [selectedResource, setSelectedResource] = useState<number>()

  useEffect(() => {
    if (resources) {
      setSelectedResource(resources[0]?.id)
    }
  }, [resources])

  const panelContent = useMemo(() => {
    if (resources && selectedResource) {
      return (
        <>
          <div className="w-full px-3 pt-4">
            <Select
              placeholder="Select a resource"
              className="w-full"
              value={selectedResource}
              onChange={(value: number) => {
                setSelectedResource(value)
              }}
            >
              {resources.map((resource) => (
                <Option key={resource.id} value={resource.id}>
                  {resource.name}
                </Option>
              ))}
            </Select>
          </div>
          <Scrollbars autoHide>
            <Tabs tabBarGutter={8} className="flex-1">
              <Tabs.TabPane
                tab={<span className="px-2">Resources</span>}
                key="resources"
                className="px-4"
              >
                <ResourceTab resourceId={selectedResource} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<span className="px-2">History</span>}
                key="history"
              />
              <Tabs.TabPane
                tab={<span className="px-2">Saved</span>}
                key="saved"
              />
            </Tabs>
          </Scrollbars>
        </>
      )
    }
  }, [resources, selectedResource])

  const pageContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Spin tip="Loading..." />
        </div>
      )
    }

    if (resources?.length === 0 || selectedResource === undefined) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Empty description="You need to connect a resource first">
            <Link to="/resources">
              <Button type="primary">Connect Resource</Button>
            </Link>
          </Empty>
        </div>
      )
    }

    return (
      <>
        <div className="flex flex-col w-64 h-full overflow-y-auto border-r">
          {panelContent}
        </div>
        <div className="flex flex-col flex-1">
          {/* Query Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <span className="text-sm">Untitled query</span>
            <div className="flex items-center space-x-4">
              <Button>New</Button>
              <Button>Save</Button>
              <Button type="primary">Run Query</Button>
            </div>
          </div>
          {/* Query editor */}
          <div className="border-b">
            <CodeMirror
              value="SELECT * FROM superstar WHERE age > 20;"
              options={{
                mode: 'sql',
                theme: 'ayu-mirage',
                lineNumbers: true,
              }}
            />
          </div>
          <div className="flex-1 px-6 py-4 border-b ">
            <div className="flex items-center justify-end gap-x-4">
              <Input
                placeholder="Search Table"
                className="w-64"
                prefix={<SearchOutlined />}
              />
              <Button icon={<DownloadOutlined />}>Download</Button>
            </div>
          </div>
        </div>
      </>
    )
  }, [isLoading, resources, selectedResource, panelContent])

  return <div className="flex flex-1 h-full">{pageContent}</div>
}
