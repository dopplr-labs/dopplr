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
      return (
        <div className="p-4 space-y-4">
          {range(10).map((val) => (
            <div
              key={val}
              className="w-full h-4 bg-gray-200 rounded animate-pulse"
              style={{ opacity: 1 - val / 10 }}
            />
          ))}
        </div>
      )
    }

    if (history) {
      return (
        <div>
          {history.map((query: any) => (
            <li
              key={query.id}
              className="flex items-center justify-between px-4 py-2 space-x-3 text-xs group hover:bg-blue-50 hover:text-blue-500"
            >
              <span className="flex-1">{query.query}</span>
              <DeleteOutlined className="invisible group-hover:visible" />
            </li>
          ))}
        </div>
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
      {historyContent}
    </Scrollbars>
  )
}
