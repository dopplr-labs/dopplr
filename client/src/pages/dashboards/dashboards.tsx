import React, { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Form, Modal, Input, Select, Menu } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'

export default function Dashboards() {
  const [show, setShow] = useState<boolean>(false)

  const categories = useMemo(
    () => [
      { id: 1, name: 'Product' },
      { id: 2, name: 'Marketing' },
      { id: 3, name: 'Users' },
    ],
    [],
  )

  function handleShowModal() {
    setShow(true)
  }

  function handleSaveDashboard() {
    setShow(false)
  }

  function handleCancel() {
    setShow(false)
  }

  const sidebarContent = useMemo(() => {
    const dashboardList = [
      {
        id: 1,
        name: 'Queries Executed',
        description:
          'Dashboard to monitor total queries executed, failed and saved by Dopplr users',
        categoryId: 1,
      },
      {
        id: 2,
        name: 'Resources Created',
        description:
          'Dashboard to monitor most used databases by the users and total queries ran on them',
        categoryId: 1,
      },
      {
        id: 3,
        name: 'Email Campaigns',
        description: 'Most effective email campaigns going on right now',
        categoryId: 2,
      },
      {
        id: 4,
        name: 'Paid Users',
        description: 'Demography of all paid customers',
        categoryId: 3,
      },
    ]

    return (
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
                <Menu.Item key={dashboard.id}>{dashboard.name}</Menu.Item>
              ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    )
  }, [categories])

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
