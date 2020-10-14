import React, { useState } from 'react'
import clsx from 'clsx'
import { Modal, Form, Input, Divider, InputNumber } from 'antd'

export default function ResourceCard({
  title,
  description,
  imagePath,
  comingSoon,
}: {
  title: string
  description: string
  imagePath: string
  comingSoon: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  function showModal() {
    if (!comingSoon) {
      setIsOpen(true)
    }
  }

  function handleOk() {
    setIsOpen(false)
  }

  function handleCancel() {
    setIsOpen(false)
  }
  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  }

  return (
    <>
      <button
        className={clsx(
          'group flex flex-col items-start justify-between relative p-4 border rounded-md focus:outline-none',
          comingSoon
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-lg hover:border-blue-500 cursor-pointer',
        )}
        onClick={showModal}
      >
        <img
          src={imagePath}
          alt="postgres logo"
          className="object-contain object-left w-20 h-10 mb-4"
        />
        <p className="mb-1 text-sm font-bold text-gray-800 group-hover:text-blue-700">
          {title}
        </p>
        <p className="text-xs text-left text-gray-600">{description}</p>

        {comingSoon ? (
          <span className="absolute top-0 right-0 mt-2 mr-4 text-xs">
            Coming Soon
          </span>
        ) : null}
      </button>
      <Modal
        visible={isOpen}
        title={title}
        width={650}
        onOk={handleOk}
        onCancel={handleCancel}
      >
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
        </Form>
      </Modal>
    </>
  )
}
