import React from 'react'
import { Button, Form, Input, InputNumber, Divider, Checkbox } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function NewConnection() {
  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  }
  return (
    <div className="flex-1 py-8">
      <div>
        <Link to="/resources">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            Back
          </Button>
        </Link>
      </div>
      <div className="max-w-2xl px-12 mx-auto rounded-md">
        <div className="flex items-center px-8 py-5 mb-8 font-semibold border-b gap-x-3">
          <img
            src={require('../../../images/resources/postgres-logo.png')}
            className="w-8 h-8"
          />
          Connect Postgres
        </div>
        <div className="px-8 mb-8">
          <Form {...formItemLayout} layout="horizontal">
            <Form.Item name="Name" label="Name" rules={[{ required: true }]}>
              <Input placeholder='i.e. "Production DB (readonly)"' />
              <span className="text-xs text-gray-600">
                The name for this resource when creating queries
              </span>
            </Form.Item>
            <Divider />
            <Form.Item name="Host" label="Host" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Port" label="Port" rules={[{ required: true }]}>
              <InputNumber defaultValue={5432} />
            </Form.Item>
            <Form.Item name="database-name" label="Database Name">
              <Input placeholder="hn_api_production" />
            </Form.Item>
            <Form.Item name="database-username" label="Database Username">
              <Input placeholder="postgres" />
            </Form.Item>
            <Form.Item name="database-password" label="Database Password">
              <Input.Password />
            </Form.Item>
            <Checkbox className="ml-40">Connect Using SSL</Checkbox>
          </Form>
        </div>
        <div className="flex px-8 py-5 space-x-2">
          <span className="flex-1" />
          <Button>Test Connection</Button>
          <Button type="primary">Create Resource</Button>
        </div>
      </div>
    </div>
  )
}
