import React, { useMemo } from 'react'
import { Empty, Result } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { range } from 'lodash-es'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-query'
import { fetchHistory } from '../queries-and-mutations'

export default function HistoryTab() {
  const { isLoading, data: history, error } = useQuery(
    ['history'],
    fetchHistory,
  )

  const historyContent = useMemo(() => {
    if (isLoading) {
      return range(10).map((val) => (
        <div
          key={val}
          className="w-full h-4 bg-gray-200 rounded animate-pulse"
          style={{ opacity: 1 - val / 10 }}
        />
      ))
    }
    if (history) {
      return (
        <ul>
          {history.map((query: any) => (
            <li
              key={query.id}
              className="flex items-center justify-between px-4 py-2 space-x-3 text-xs group hover:bg-gray-100"
            >
              <span className="flex-1">{query.query}</span>
              <DeleteOutlined className="invisible group-hover:visible" />
            </li>
          ))}
        </ul>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    return (
      <div className="flex items-center justify-center h-full">
        <Empty
          description={<span className="text-xs">Run your first query</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }, [isLoading, history, error])

  return (
    <Scrollbars className="h-full" autoHide>
      <div className="space-y-4">{historyContent}</div>
    </Scrollbars>
  )
}
