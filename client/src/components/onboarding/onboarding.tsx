import React from 'react'
import { Popover, Progress } from 'antd'

export default function Onboarding() {
  return (
    <Popover
      placement="rightBottom"
      content={
        <div>
          <div className="pb-2 text-center border-b">Getting Started</div>
          <div className="pt-2 space-y-4">
            <div>1. Connect a resource</div>
            <div>2. Run a query</div>
            <div>3. Plot a chart</div>
          </div>
        </div>
      }
    >
      <Progress
        className="py-4"
        width={64}
        type="circle"
        strokeLinecap="round"
        strokeWidth={12}
        percent={75}
      />
    </Popover>
  )
}
