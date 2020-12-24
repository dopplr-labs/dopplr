import React, { useCallback, useMemo, useState } from 'react'
import { range } from 'lodash-es'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Result,
  Modal,
  message,
  Checkbox,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
import { Resource } from 'types/resource'
import {
  deleteResource,
  fetchResource,
  testSavedResource,
  updateResource,
} from '../queries'

export default function ResourceDetail() {
  const { resourceId } = useParams() as { resourceId: string }
  const [sslRequired, setSslRequired] = useState(false)
  const [selfCertificate, setSelfCertificate] = useState(false)

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
    try {
      const response = await testSavedResource(Number.parseInt(resourceId, 10))
      message.success(response.message)
    } catch (error) {
      message.error(error.message)
    }
  }, [resourceId])

  const formContent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <div className="flex items-center justify-between px-6 py-4 space-x-4 border-b bg-background-primary">
            <div>
              <div className="text-base font-medium text-content-primary">
                Connect to Postgres
              </div>
              <div className="text-sm">
                Connect your Postgres database to run queries and create
                dashboard
              </div>
            </div>
            <img
              src={require('images/resources/postgres-logo.png')}
              className="w-6 h-6"
              alt="Postgres"
            />
          </div>

          <div className="flex p-6 space-x-32 border-b">
            <div className="w-24 h-8 bg-background-secondary animate-pulse" />
            <div className="flex-1 h-8 bg-background-secondary animate-pulse" />
          </div>

          <div className="p-6 space-y-6 border-b">
            {range(5).map((val) => (
              <div key={val} className="flex space-x-32">
                <div
                  className="w-24 h-8 bg-background-secondary animate-pulse"
                  style={{ opacity: 1 - val / 5 }}
                />
                <div
                  className="flex-1 h-8 bg-background-secondary animate-pulse"
                  style={{ opacity: 1 - val / 5 }}
                />
              </div>
            ))}
          </div>

          <div className="flex px-6 py-4 space-x-4">
            <div className="w-20 h-8 bg-background-secondary animate-pulse" />
            <div className="flex-1" />
            <div className="w-20 h-8 bg-background-secondary animate-pulse" />
            <div className="w-20 h-8 bg-background-secondary animate-pulse" />
          </div>
        </>
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
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 20 }}
          labelAlign="left"
          onValuesChange={() => {
            setDisabled(false)
          }}
          onFinish={onFinish}
        >
          <div className="flex items-center justify-between px-6 py-4 space-x-4 border-b bg-background-primary">
            <div>
              <div className="text-base font-medium text-content-primary">
                {resource.name}
              </div>
              <div className="text-sm">
                Connect your Postgres database to run queries and create
                dashboard
              </div>
            </div>
            <img
              src={require('images/resources/postgres-logo.png')}
              className="w-6 h-6"
              alt="Postgres"
            />
          </div>

          <div className="p-6 border-b">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: 'Please enter the resource name' },
              ]}
              className="mb-0"
            >
              <Input placeholder='i.e. "Production DB (readonly)"' />
            </Form.Item>
          </div>

          <div className="p-6 border-b">
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
            <Form.Item label=" " colon={false} className="mb-2">
              <Checkbox
                checked={sslRequired}
                onChange={(e) => {
                  setSslRequired(e.target.checked)
                }}
              >
                Connect Using SSL
              </Checkbox>
            </Form.Item>
            {sslRequired ? (
              <>
                <Form.Item label=" " colon={false}>
                  <Checkbox
                    checked={selfCertificate}
                    onChange={(e) => {
                      setSelfCertificate(e.target.checked)
                    }}
                  >
                    Use a self-signed certificate
                  </Checkbox>
                </Form.Item>
                {selfCertificate ? (
                  <>
                    <Form.Item name="clientKey" label="Client Key">
                      <Input.TextArea
                        className="text-xs"
                        style={{ height: 108 }}
                        placeholder="-----BEGIN CERTIFICATE-----
              MIIEMDCCApigAwIBAgIDI2GWMA0GCSqGSIb3DQEBDAUAMDoxODA2BgNVBAMML2Fm
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
...
-----END CERTIFICATE-----
              "
                      />
                    </Form.Item>
                    <Form.Item
                      name="clientCertificate"
                      label="Client Certificate"
                    >
                      <Input.TextArea
                        className="text-xs"
                        style={{ height: 108 }}
                        placeholder="-----BEGIN CERTIFICATE-----
              MIIEMDCCApigAwIBAgIDI2GWMA0GCSqGSIb3DQEBDAUAMDoxODA2BgNVBAMML2Fm
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
              DTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4
...
-----END CERTIFICATE-----
              "
                      />
                    </Form.Item>
                  </>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="flex px-6 py-4 space-x-4">
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
    selfCertificate,
    sslRequired,
  ])

  return (
    <div className="max-w-3xl overflow-hidden border rounded-md">
      {formContent}
    </div>
  )
}
