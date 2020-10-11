import React from 'react'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Input, Tabs } from 'antd'
import { UnControlled as CodeMirror } from 'react-codemirror2'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/ayu-mirage.css')
require('codemirror/mode/sql/sql')

export default function Queries() {
  return (
    <div className="flex flex-1 h-full">
      <div className="w-64 h-full border-r">
        <Tabs tabBarGutter={8}>
          <Tabs.TabPane
            tab={<span className="px-2">Resources</span>}
            key="resources"
            className="px-4"
          >
            <Input
              placeholder="Search Tables and Columns"
              prefix={<SearchOutlined />}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<span className="px-2">History</span>}
            key="history"
          />
          <Tabs.TabPane tab={<span className="px-2">Saved</span>} key="saved" />
        </Tabs>
        <div className="px-6 space-y-4" />
      </div>
      <div className="flex flex-col flex-1">
        {/* Query Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-sm">Untitled query</span>
          <div className="flex items-center space-x-4">
            <Button>Save</Button>
            <Button type="primary">Run Query</Button>
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
    </div>
  )
}
