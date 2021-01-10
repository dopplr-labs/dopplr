import React, { useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Form, Modal, Input, Select, Menu } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import { dashboardList, categories } from './data/dashboard-data'

export default function Dashboards() {
  const [show, setShow] = useState<boolean>(false)
  const navigate = useNavigate()

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
      <Menu
        mode="inline"
        defaultOpenKeys={['sub-1']}
        defaultSelectedKeys={['1']}
      >
        {categories.map((category) => (
          <Menu.SubMenu key={`sub-${category.id}`} title={category.name}>
            {dashboardList
              .filter((dashboard) => dashboard.categoryId === category.id)
              .map((dashboard) => (
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
    [navigate],
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
              {categories.map((category) => (
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
