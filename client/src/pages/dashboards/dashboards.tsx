import React, { useMemo, useState } from 'react'
import { Button, Menu, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import { fetchCategories } from './queries'

export default function Dashboards() {
  const [show, setShow] = useState<boolean>(false)
  const navigate = useNavigate()

  const { data: categories } = useQuery(['categories'], fetchCategories)

  function handleShowModal() {
    setShow(true)
  }

  function handleSaveDashboard() {
    setShow(false)
  }

  function handleCancel() {
    setShow(false)
  }

  const sidebarContent = useMemo(
    () => (
      <Menu mode="inline">
        {categories?.map((category) => (
          <Menu.SubMenu key={`sub-${category.id}`} title={category.name}>
            {category.dashboards?.map((dashboard) => (
              <Menu.Item
                key={dashboard.id}
                onClick={() => {
                  navigate(`/dashboards/${dashboard.id}`)
                }}
              >
                {dashboard.name}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    ),
    [categories, navigate],
  )

  return (
    <>
      <PageLayout
        sidebar={
          <PageSideBar
            title="Dashboards"
            description="Create and manage your dashboards here"
            primaryAction={
              <Button
                icon={<PlusOutlined />}
                className="w-full"
                type="primary"
                onClick={handleShowModal}
              >
                Create New
              </Button>
            }
            items={sidebarContent}
          />
        }
        content={<Outlet />}
      />
      <Modal
        title="Create New Dashboard"
        width={640}
        visible={show}
        onCancel={handleCancel}
        onOk={handleSaveDashboard}
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input placeholder="Give your dashboard a name" />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              placeholder="Add a brief description to let other users know what story this dashboard is going to tell"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Category" required>
            <Select placeholder="Select a category to add dashboard">
              {categories?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
