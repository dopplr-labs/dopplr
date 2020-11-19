import React, { useState, useMemo } from 'react'
import { Dropdown, Menu } from 'antd'
import {
  DownOutlined,
  EllipsisOutlined,
  RightOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { History } from 'types/history'

export type DayHistoryProps = {
  singleDayHistory: History[]
  date: string
}

export default function DayHistory({
  singleDayHistory,
  date,
}: DayHistoryProps) {
  const [show, setShow] = useState(true)

  const historyMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item key="0" className="flex items-center space-x-2 text-xs">
          <DeleteOutlined />
          <span>Clear Query</span>
        </Menu.Item>
      </Menu>
    )
  }, [])

  return (
    <div className="border-b">
      <div
        className="flex items-center px-3 py-2 space-x-1 font-mono text-xs font-bold text-blue-500 cursor-pointer hover:bg-blue-50"
        onClick={() => {
          setShow((prevState) => !prevState)
        }}
      >
        {show ? <DownOutlined /> : <RightOutlined />}
        <span>{date}</span>
      </div>
      {show ? (
        <ul>
          {singleDayHistory.map((query) => (
            <li
              key={query.id}
              className="flex items-center justify-between py-2 pl-8 pr-3 space-x-1 text-xs cursor-pointer hover:bg-gray-50 group"
            >
              <span>{query.query}</span>
              <Dropdown overlay={historyMenu} trigger={['click']}>
                <button className="invisible px-1 focus:outline-none group-hover:visible">
                  <EllipsisOutlined className="text-lg" />
                </button>
              </Dropdown>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
