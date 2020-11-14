import React, { useCallback, useMemo, useState } from 'react'
import { range } from 'lodash-es'
import { Form, Input, InputNumber, Button, Result, Modal, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
import { Resource } from 'types/resource'
import {
  deleteResource,
  fetchResource,
  testResourceConnection,
  updateResource,
} from '../queries'

export default function ResourceForm() {
  const { resourceId } = useParams() as { resourceId: string }

  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { isLoading, data: resource, error } = useQuery(
    ['resources', resourceId],
    () => fetchResource(resourceId),
    {
      onSuccess: (data) => {
        const { name, host, port, database, username, password } = data
        form.setFieldsValue({ name, host, port, database, username, password })
      },
    },
  )

  const resources: Resource[] | undefined = queryCache.getQueryData([
    'resources',
  ])
  const [disabled, setDisabled] = useState(true)

  const [editResource] = useMutation(updateResource, {
    onMutate: (updatedResource) => {
      queryCache.setQueryData(
        ['resources'],
        resources?.map((resource) =>
          resource.id === updatedResource.id
            ? { ...resource, ...updatedResource }
            : resource,
        ),
      )
      queryCache.setQueryData(['resources', resourceId], {
        ...resource,
        ...updatedResource,
      })
    },
    onSuccess: () => {
      message.success('Resource updated successfully')
    },
  })

  const [removeResource] = useMutation(deleteResource, {
    onMutate: (deletedResource) => {
      queryCache.setQueryData(
        ['resources'],
        resources?.filter((resource) => resource.id !== deletedResource.id),
      )
      queryCache.removeQueries(['resources', resourceId])
      navigate('/resources')
    },
  })

  const onFinish = useCallback(
    (values: any) => {
      const { name, host, port, database, username, password } = values
      const id = parseInt(resourceId)
      editResource({
        id,
        name,
        host,
        port,
        database,
        username,
        password,
      })
    },
    [editResource, resourceId],
  )

  const confirmDelete = useCallback(() => {
    Modal.confirm({
      title: 'Delete this resource?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        removeResource({ id: parseInt(resourceId) })
      },
    })
  }, [removeResource, resourceId])

  const pingConnection = useCallback(async () => {
    const {
      name,
      host,
      port,
      database,
      username,
      password,
    } = form.getFieldsValue()
    try {
      const response = await testResourceConnection({
        name,
        type: 'postgres',
        host,
        port,
        database,
        username,
        password,
      })
      message.success(response.message)
    } catch (error) {
      message.error(error.message)
    }
  }, [form])

  const formContent = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          <img
            src={require('images/resources/postgres-logo.png')}
            className="w-5 h-5 mb-4"
            alt="Postgres"
          />
          <div className="font-medium text-gray-800">Connect to Postgres</div>
          <div className="mb-6 text-xs">
            Connect your Postgres database to run queries and create dashboard
          </div>
          <div className="flex mb-6 space-x-32">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mb-6 border-b" />
          <div>
            <div className="font-medium text-gray-800">
              Database Configuration
            </div>
            <div className="mb-6 text-xs">
              This configuration would be used to connect with your Postgres
              database
            </div>
          </div>
          {range(5).map((val) => (
            <div key={val} className="flex mb-6 space-x-32">
              <div
                className="w-24 h-8 bg-gray-200 rounded animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
              <div
                className="flex-1 h-8 bg-gray-200 rounded animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
            </div>
          ))}
          <div className="flex p-4 -mx-4 -mb-4 space-x-4 bg-gray-50">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1" />
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (resource) {
      return (
        <Form
          layout="horizontal"
          form={form}
          name="update-resource"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          onValuesChange={() => {
            setDisabled(false)
          }}
          onFinish={onFinish}
        >
          <img
            src={require('images/resources/postgres-logo.png')}
            className="w-5 h-5 mb-4"
            alt="Postgres"
          />
          <div className="font-medium text-gray-800">Connect to Postgres</div>
          <div className="mb-6 text-xs">
            Connect your Postgres database to run queries and create dashboard
          </div>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter the resource name' },
            ]}
          >
            <Input placeholder='i.e. "Production DB (readonly)"' />
          </Form.Item>

          <div className="mb-6 border-b" />

          <div>
            <div className="font-medium text-gray-800">
              Database Configuration
            </div>
            <div className="mb-6 text-xs">
              This configuration would be used to connect with your Postgres
              database
            </div>
          </div>
          <Form.Item
            name="host"
            label="Host"
            rules={[
              {
                required: true,
                message: 'Please enter the database host url',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="Port"
            rules={[
              { required: true, message: 'Please enter the database port' },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="database"
            label="Database"
            rules={[
              { required: true, message: 'Please enter the database name' },
            ]}
          >
            <Input placeholder="hn_api_production" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Database Username"
            rules={[
              {
                required: true,
                message: 'Please enter the database user name',
              },
            ]}
          >
            <Input placeholder="postgres" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Database Password"
            rules={[
              {
                required: true,
                message: 'Please enter the database password',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="flex p-4 -mx-4 -mb-4 space-x-4 bg-gray-50">
            <Link to="/resources">
              <Button htmlType="button" icon={<ArrowLeftOutlined />}>
                Back
              </Button>
            </Link>
            <div className="flex-1" />
            <Button htmlType="button" onClick={pingConnection}>
              Test Connection
            </Button>
            <Button htmlType="button" danger onClick={confirmDelete}>
              Delete
            </Button>
            <Button type="primary" htmlType="submit" disabled={disabled}>
              Save
            </Button>
          </div>
        </Form>
      )
    }

    return null
  }, [
    isLoading,
    resource,
    error,
    disabled,
    onFinish,
    confirmDelete,
    form,
    pingConnection,
  ])

  return (
    <div className="flex-1 px-12 py-8 space-x-6 bg-gray-50">
      <div className="flex items-start w-full max-w-screen-md mx-auto space-x-8">
        <div className="flex-1 p-4 overflow-hidden bg-white rounded-md shadow">
          {formContent}
        </div>
      </div>
    </div>
  )
}
