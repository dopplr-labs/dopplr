import React, { useRef } from 'react'
import { Input, Button } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  CaretRightFilled,
  SaveOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import MonacoEditor from 'react-monaco-editor'
import Editor from 'components/editor'

export default function QueryEditor({ resourceId }: { resourceId: number }) {
  const editor = useRef<MonacoEditor | null>(null)
  return (
    <>
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
      <div className="border-b">
        <Editor
          resourceId={resourceId}
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
    </>
  )
}
