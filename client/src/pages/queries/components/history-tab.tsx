import React, { useMemo } from 'react'
import { Empty, Result } from 'antd'
import dayjs from 'dayjs'
import { groupBy, range } from 'lodash-es'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-query'
import { fetchHistory } from '../queries-and-mutations'
import DayHistory from './day-history'

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
      const groupedHistory = groupBy(history, (item) => {
        const today = dayjs().format('DD MMMM')
        const yesterday = dayjs().subtract(1, 'day').format('DD MMMM')
        const formattedCreatedDay = dayjs(item.createdAt).format('DD MMMM')
        if (formattedCreatedDay === today) {
          return 'Today'
        }
        if (formattedCreatedDay === yesterday) {
          return 'Yesterday'
        }
        return formattedCreatedDay
      })

      return Object.keys(groupedHistory).map((date) => (
        <DayHistory
          key={date}
          date={date}
          singleDayHistory={groupedHistory[date]}
        />
      ))
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
