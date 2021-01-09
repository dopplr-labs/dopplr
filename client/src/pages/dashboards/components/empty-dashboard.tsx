import React from 'react'
import { Result, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function EmptyDashboard() {
  return (
    <Result
      status="404"
      title="No Dashboard Available"
      subTitle="You haven't created any dashboard yet. Create your 1st dashboard to get started."
      extra={
        <Button icon={<PlusOutlined />} type="primary">
          Create New
        </Button>
      }
    />
  )
}
