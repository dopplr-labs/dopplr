import { PlusOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateResourceMessage() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-xs">
            No resources have been created. Create a resource to run query
          </span>
        }
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/resources')
          }}
        >
          Create Resource
        </Button>
      </Empty>
    </div>
  )
}
