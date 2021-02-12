import React, { useMemo, useState } from 'react'
import { Button, Menu, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { range } from 'lodash-es'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import { createCategory, createDashboard, fetchCategories } from './queries'

enum CreateOptions {
  DASHBOARD = 'dashboard',
  CATEGORY = 'category',
}

export default function Dashboards() {
  const [createDashboardModal, setCreateDashboardModal] = useState(false)
  const [createOption, setCreateOption] = useState<CreateOptions>(
    CreateOptions.DASHBOARD,
  )
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data: categories, isLoading } = useQuery(
    ['categories'],
    fetchCategories,
  )

  const queryClient = useQueryClient()

  const { mutate: addCategory, isLoading: isCreatingCategory } = useMutation(
    createCategory,
    {
      onSuccess: (createdCategory) => {
        queryClient.setQueryData(
          ['categories'],
          categories ? [...categories, createdCategory] : [createdCategory],
        )
        message.success('Category created successfully')
        form.resetFields()
        setCreateDashboardModal(false)
      },
    },
  )

  const { mutate: addDashboard, isLoading: isCreatingDashboard } = useMutation(
    createDashboard,
    {
      onSuccess: (createdDashboard) => {
        queryClient.setQueryData(
          ['categories'],
          categories
            ? categories.map((category) =>
                category.id === createdDashboard.category.id
                  ? {
                      ...category,
                      dashboards: category.dashboards
                        ? [...category.dashboards, createdDashboard]
                        : [createCategory],
                    }
                  : category,
              )
            : undefined,
        )
        message.success('Dashboard created successfully')
        form.resetFields()
        setCreateDashboardModal(false)
      },
    },
  )

  function handleSubmit() {
    if (createOption === CreateOptions.CATEGORY) {
      const { categoryName } = form.getFieldsValue()
      addCategory({ name: categoryName })
    }
    if (createOption === CreateOptions.DASHBOARD) {
      const { dashboardName, description, category } = form.getFieldsValue()
      addDashboard({ name: dashboardName, description, category })
    }
  }

  function handleShowModal() {
    setCreateDashboardModal(true)
  }

  function handleOk() {
    form.submit()
  }

  function handleCancel() {
    setCreateDashboardModal(false)
  }

  const sidebarContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {range(3).map((val) => (
            <div key={val} className="px-3 space-y-4">
              <div className="w-full h-8 bg-background-secondary animate-pulse" />
              <div className="pl-6 space-y-4">
                <div className="w-full h-6 bg-background-secondary animate-pulse" />
                <div className="w-full h-6 bg-background-secondary animate-pulse" />
                <div className="w-full h-6 bg-background-secondary animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (categories) {
      return (
        <Menu
          mode="inline"
          defaultOpenKeys={categories.map((category) => `sub-${category.id}`)}
        >
          {categories.map((category) => (
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
      )
    }
  }, [categories, isLoading, navigate])

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
        visible={createDashboardModal}
        onCancel={handleCancel}
        onOk={handleOk}
        okButtonProps={{ loading: isCreatingCategory || isCreatingDashboard }}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Create" required>
            <Select
              placeholder="Dashboard or Category?"
              defaultValue={CreateOptions.DASHBOARD}
              onChange={setCreateOption}
            >
              <Select.Option value={CreateOptions.CATEGORY}>
                Category
              </Select.Option>
              <Select.Option value={CreateOptions.DASHBOARD}>
                Dashboard
              </Select.Option>
            </Select>
          </Form.Item>
          {createOption === CreateOptions.DASHBOARD ? (
            <>
              <Form.Item label="Name" name="dashboardName" required>
                <Input placeholder="Give your dashboard a name" />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea
                  placeholder="Add a brief description to let other users know what story this dashboard is going to tell"
                  rows={4}
                />
              </Form.Item>
              <Form.Item label="Category" name="category" required>
                <Select placeholder="Select a category to add dashboard">
                  {categories?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : createOption === CreateOptions.CATEGORY ? (
            <Form.Item label="Name" name="categoryName">
              <Input placeholder="Enter the name for category" />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </>
  )
}
