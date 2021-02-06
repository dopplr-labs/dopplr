import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Result,
} from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getResource } from 'utils/resource'
import {
  createResource,
  fetchResources,
  testResourceConnection,
} from '../queries'

export default function CreateResource() {
  const { resourceType } = useParams() as { resourceType: string }
  const [sslRequired, setSslRequired] = useState(false)
  const [selfCertificate, setSelfCertificate] = useState(false)

  const resource = getResource(resourceType)

  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { data: resources } = useQuery(['resources'], fetchResources)

  const queryClient = useQueryClient()
  const { mutate: addResource, isLoading } = useMutation(createResource, {
    onSuccess: (createdResource) => {
      queryClient.setQueryData(
        ['resources'],
        resources ? [...resources, createdResource] : [createdResource],
      )
      navigate(`/resources/${createdResource.id}`)
    },
  })

  function onFinish(values: any) {
    addResource({
      type: resourceType,
      sslRequired,
      ...values,
    })
  }

  const [testingConnection, setTestingConnection] = useState(false)

  async function pingConnection() {
    setTestingConnection(true)
    try {
      await form.validateFields([
        'host',
        'port',
        'database',
        'username',
        'password',
        ...(selfCertificate ? ['clientKey', 'clientCertificate'] : []),
      ])
      const formValues = form.getFieldsValue()
      const response = await testResourceConnection({
        type: resourceType,
        sslRequired,
        selfCertificate,
        ...formValues,
      })
      if (response.success) {
        message.success(response.message)
      } else {
        message.error(response.message)
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ??
          'Something went wrong. Please try again',
      )
    } finally {
      setTestingConnection(false)
    }
  }

  if (!resource) {
    return (
      <Result
        status="404"
        title="Unknown Resource Type"
        subTitle="Sorry, the page doesn't exist. Come back later"
        extra={
          <Link to="/resources">
            <Button type="primary">Create Resource</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="max-w-3xl space-y-4 overflow-hidden border rounded-md">
      <Form
        layout="horizontal"
        form={form}
        name="create-resource"
        initialValues={{ port: resource?.defaultConfig?.port }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left"
        onFinish={onFinish}
      >
        <div className="flex items-center justify-between px-6 py-4 space-x-4 border-b bg-background-primary">
          <div>
            <div className="text-base font-medium text-content-primary">
              Connect to {resource.title}
            </div>
            <div className="text-sm">
              Connect your {resource.title} database to run queries and create
              dashboard
            </div>
          </div>
          <img src={resource.image} className="w-6 h-6" alt={resource.title} />
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
            <Input placeholder={resource?.defaultConfig?.database} />
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
                  <Form.Item
                    name="clientKey"
                    label="Client Key"
                    rules={[
                      {
                        required: true,
                        message:
                          'Please enter client key when using self-signed certificate',
                      },
                    ]}
                  >
                    <Input.TextArea
                      className="text-xs"
                      style={{ height: 108 }}
                      placeholder={
                        '-----BEGIN CERTIFICATE-----\nMIIEMDCCApigAwIBAgIDI2GWMA0GCSqGSIb3DQEBDAUAMDoxODA2BgNVBAMML2Fm\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\n...\n-----END CERTIFICATE-----'
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="clientCertificate"
                    label="Client Certificate"
                    rules={[
                      {
                        required: true,
                        message:
                          'Please enter client certificate when using self-signed certificate',
                      },
                    ]}
                  >
                    <Input.TextArea
                      className="text-xs"
                      style={{ height: 108 }}
                      placeholder={
                        '-----BEGIN CERTIFICATE-----\nMIIEMDCCApigAwIBAgIDI2GWMA0GCSqGSIb3DQEBDAUAMDoxODA2BgNVBAMML2Fm\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\nDTE5MDQwODAzNDIyMloXDTI5MDQwNTAzNDIyMlowOjE4MDYGA1UEAwwvYWY1ZjU4\n...\n-----END CERTIFICATE-----'
                      }
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
          <Button
            htmlType="button"
            onClick={pingConnection}
            loading={testingConnection}
          >
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
