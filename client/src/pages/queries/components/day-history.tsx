import React, { useState } from 'react'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import { History } from 'types/history'
import HistoryQuery from './history-query'

export type DayHistoryProps = {
  singleDayHistory: History[]
  date: string
}

export default function DayHistory({
  singleDayHistory,
  date,
}: DayHistoryProps) {
  const [show, setShow] = useState(true)

  return (
    <div>
      <div
        className="flex items-center px-3 py-2 space-x-1 text-xs font-medium cursor-pointer text-brand-primary hover:bg-brand-light"
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
            <HistoryQuery key={query.id} query={query} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
