import React from 'react'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function Settings() {
  return (
    <div>
      <Result
        status="404"
        title="Under Construction"
        subTitle="Sorry, the page doesn't exist. Come back later"
        extra={
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        }
      />
    </div>
  )
}
