import React, { useCallback, useMemo } from 'react'
import { Button, Empty, Modal, Result, Spin } from 'antd'
import dayjs from 'dayjs'
import { groupBy, range } from 'lodash-es'
import InfiniteScroll from 'react-infinite-scroller'
import Scrollbars from 'react-custom-scrollbars'
import { queryCache, useMutation, useInfiniteQuery } from 'react-query'
import { DeleteOutlined } from '@ant-design/icons'
import { clearHistoryQuery, fetchHistories } from '../queries-and-mutations'
import DayHistory from './day-history'

export default function HistoriesTab() {
  const { isLoading, data, fetchMore, error } = useInfiniteQuery(
    ['history'],
    fetchHistories,
    {
      getFetchMore: (lastGroup) => lastGroup.meta.nextPage,
      onSuccess: (pages) => {
        pages.forEach((page) => {
          page.items.forEach((history) => {
            queryCache.setQueryData(['history', history.id], history)
          })
        })
      },
    },
  )

  const [clearAllHistory] = useMutation(clearHistoryQuery, {
    onMutate: () => {
      queryCache.refetchQueries(['history'])
    },
  })

  const confirmDeleteHistory = useCallback(() => {
    Modal.confirm({
      title: 'Clear all histroy?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        clearAllHistory()
      },
    })
  }, [clearAllHistory])

  const historyContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4">
          {range(10).map((val) => (
            <div
              key={val}
              className="w-full h-4 bg-gray-200 animate-pulse"
              style={{ opacity: 1 - val / 10 }}
            />
          ))}
        </div>
      )
    }

    if (data && data.length > 0) {
      // using reduce to flatten array from 2d to 1d
      const history = data
        .map((page) => page.items)
        .reduce((prev, curr) => prev.concat(curr))

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

      return (
        <>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchMore()}
            hasMore={data[data.length - 1].meta.hasMore}
            loader={
              <div className="flex items-center justify-center py-2" key={0}>
                <Spin tip="Loading..." size="small" />
              </div>
            }
            useWindow={false}
          >
            {Object.keys(groupedHistory).map((date) => (
              <DayHistory
                key={date}
                date={date}
                singleDayHistory={groupedHistory[date]}
              />
            ))}
          </InfiniteScroll>
        </>
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
  }, [isLoading, data, error, fetchMore])

  return (
    <div className="flex flex-col h-full">
      <Scrollbars className="flex-1" autoHide>
        {historyContent}
      </Scrollbars>
      <div className="border-t">
        <Button
          onClick={confirmDeleteHistory}
          icon={<DeleteOutlined />}
          type="link"
          className="w-full"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
