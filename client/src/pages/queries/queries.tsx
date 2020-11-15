import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Input, Select, Spin, Tabs, Button, Empty } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { fetchResources } from 'pages/resources/queries'
import Editor from 'components/editor'
import MonacoEditor from 'react-monaco-editor'
import SchemaTab from './components/schema-tab'

export default function Queries() {
  const { Option } = Select

  const { isLoading, data: resources } = useQuery(['resources'], fetchResources)
  const [selectedResource, setSelectedResource] = useState<number>()
  const editor = useRef<MonacoEditor | null>(null)

  useEffect(() => {
    if (resources) {
      setSelectedResource(resources[0]?.id)
    }
  }, [resources])

  const panelContent = useMemo(() => {
    if (resources && selectedResource) {
      return (
        <div className="flex flex-col h-full py-3 space-y-2">
          <div className="mx-3">
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
          <Tabs className="flex-1 queries-tab" size="small" centered>
            <Tabs.TabPane tab="Schema" key="schema" className="h-full">
              <SchemaTab resourceId={selectedResource} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="History" key="history" />
            <Tabs.TabPane tab="Saved" key="saved" />
          </Tabs>
        </div>
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
        <div className="flex flex-col h-full overflow-y-auto border-r w-72">
          {panelContent}
        </div>
        <div className="flex flex-col flex-1 pt-4 tabs-container">
          <Tabs
            type="editable-card"
            tabBarExtraContent={{ left: <div className="w-4" /> }}
          >
            <Tabs.TabPane
              tab={
                <span className="text-xs text-gray-800">Untitled Query</span>
              }
              className="w-full"
            >
              {/* Query Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b">
                <span className="text-sm">Untitled query</span>
                <div className="flex items-center space-x-4">
                  <Button
                    icon={<CodeOutlined />}
                    onClick={() => {
                      editor.current?.editor
                        ?.getAction('editor.action.formatDocument')
                        .run()
                    }}
                  >
                    Beautify
                  </Button>
                  <Button icon={<SaveOutlined />}>Save</Button>
                  <Button type="primary" icon={<CaretRightFilled />}>
                    Run Query
                  </Button>
                </div>
              </div>
              {/* Query editor */}
              <div className="border-b">
                <Editor
                  resourceId={selectedResource}
                  ref={(monacoEditor) => {
                    editor.current = monacoEditor
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
            </Tabs.TabPane>
          </Tabs>
        </div>
      </>
    )
  }, [isLoading, resources, selectedResource, panelContent])

  return <div className="flex flex-1 h-full">{pageContent}</div>
}
