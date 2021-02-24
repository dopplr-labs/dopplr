import React from 'react'
import { Button } from 'antd'
import {
  CheckOutlined,
  DownOutlined,
  PlayCircleFilled,
  RightOutlined,
} from '@ant-design/icons'

type StepProps = {
  id: number
  title: string
  description: string | React.ReactNode
  cta: string
  completed: boolean
  isOpen: boolean
  openStep: (id: number) => void
}
export default function Step({
  id,
  title,
  description,
  cta,
  completed,
  isOpen,
  openStep,
}: StepProps) {
  return (
    <div className="space-y-4 border rounded-md">
      <div
        className="flex items-center w-full p-6 space-x-4 cursor-pointer"
        onClick={() => {
          openStep(id)
        }}
      >
        {completed ? (
          <span className="flex items-center justify-center w-6 h-6 text-white bg-green-600 rounded-full">
            <CheckOutlined />
          </span>
        ) : (
          <span className="flex items-center justify-center w-6 h-6 p-1 text-gray-700 border border-gray-700 rounded-full">
            {id}
          </span>
        )}
        <p className="font-semibold">{title}</p>
        <div className="flex-1" />
        {isOpen ? <DownOutlined /> : <RightOutlined />}
      </div>
      {isOpen ? (
        <div className="flex items-start justify-center w-full px-8 pb-6">
          <div className="w-1/2 px-2 space-y-4">
            <p className="pr-4">{description}</p>
            <Button type="primary">{cta}</Button>
          </div>
          <div className="w-1/2">
            <div className="flex items-center justify-center h-48 max-w-sm mx-auto ml-4 bg-blue-100 rounded-md">
              <PlayCircleFilled className="text-6xl text-blue-600" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
