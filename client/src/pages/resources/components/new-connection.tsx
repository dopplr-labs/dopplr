import React from 'react'
import { Button, Form, Input, InputNumber, Divider } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { queryCache, useMutation, useQuery } from 'react-query'
import {
  createResource,
  fetchResources,
} from '../../../queries/resourceQueries'

export default function NewConnection() {
  const { data: resources } = useQuery(['resources'], fetchResources)

  const [addResource, { isLoading }] = useMutation(createResource, {
    onSuccess: (createdResource) => {
      queryCache.setQueryData(
        ['resources'],
        resources ? [...resources, createdResource] : [createdResource],
      )
    },
  })

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const onFinish = (values: any) => {
    const { name, host, port, database, username, password } = values
    addResource({
      name,
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
    })
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
            alt="Postgres"
          />
          Connect Postgres
        </div>
        <div className="px-8 mb-8">
          <Form
            {...formItemLayout}
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{ port: 5432 }}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder='i.e. "Production DB (readonly)"' />
            </Form.Item>
            <Divider />
            <Form.Item name="host" label="Host" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="port" label="Port" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="database" label="Database Name">
              <Input placeholder="hn_api_production" />
            </Form.Item>
            <Form.Item name="username" label="Database Username">
              <Input placeholder="postgres" />
            </Form.Item>
            <Form.Item name="password" label="Database Password">
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button htmlType="button" className="mr-2">
                Test Connection
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Create Resource
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
