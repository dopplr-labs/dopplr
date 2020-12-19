import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, message } from 'antd'
import { queryCache, useMutation, useQuery } from 'react-query'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createResource,
  fetchResources,
  testResourceConnection,
} from '../queries'

export default function CreateResource() {
  const { resourceType } = useParams() as { resourceType: string }
  const [sslRequired, setSslRequired] = useState(false)
  const [selfCertificate, setSelfCertificate] = useState(false)

  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { data: resources } = useQuery(['resources'], fetchResources)

  const [addResource, { isLoading }] = useMutation(createResource, {
    onSuccess: (createdResource) => {
      queryCache.setQueryData(
        ['resources'],
        resources ? [...resources, createdResource] : [createdResource],
      )
      navigate(`/resources/${createdResource.id}`)
    },
  })

  function onFinish(values: any) {
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

  if (resourceType !== 'postgres') {
    return null
  }

  async function pingConnection() {
    await form.validateFields([
      'host',
      'port',
      'database',
      'username',
      'password',
    ])

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
      message.error(
        error.response?.data?.message ??
          'Something went wrong. Please try again',
      )
    }
  }

  return (
    <div className="max-w-3xl space-y-4 overflow-hidden border rounded-md">
      <Form
        layout="horizontal"
        form={form}
        name="create-resource"
        initialValues={{ port: 5432 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left"
        onFinish={onFinish}
      >
        <div className="flex items-center justify-between px-6 py-4 space-x-4 border-b bg-background-secondary">
          <div>
            <div className="text-base font-medium text-content-primary">
              Connect to Postgres
            </div>
            <div className="text-sm">
              Connect your Postgres database to run queries and create dashboard
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
            <Button
              htmlType="button"
              className="mr-2"
              icon={<ArrowLeftOutlined />}
            >
              Back
            </Button>
          </Link>
          <div className="flex-1" />
          <Button htmlType="button" onClick={pingConnection}>
            Test Connection
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Resource
          </Button>
        </div>
      </Form>
    </div>
  )
}
