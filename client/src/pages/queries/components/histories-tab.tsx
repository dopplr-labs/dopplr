import React, { useCallback, useMemo } from 'react'
import { Button, Empty, Modal, Result, Spin } from 'antd'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'
import InfiniteScroll from 'react-infinite-scroller'
import Scrollbars from 'react-custom-scrollbars'
import { useMutation, useInfiniteQuery, useQueryClient } from 'react-query'
import { DeleteOutlined } from '@ant-design/icons'
import { clearHistoryQuery, fetchHistories } from '../queries-and-mutations'
import DayHistory from './day-history'
import ListSkeletonLoader from './list-skeleton-loader'

export default function HistoriesTab() {
  const queryClient = useQueryClient()
  const {
    isLoading,
    data,
    fetchNextPage,
    error,
    hasNextPage,
  } = useInfiniteQuery(
    ['history'],
    ({ pageParam }) => fetchHistories(pageParam),
    {
      getNextPageParam: (lastGroup) =>
        lastGroup.meta.hasMore ? lastGroup.meta.nextPage : undefined,
      onSuccess: ({ pages }) => {
        pages.forEach((page) => {
          page.items.forEach((history) => {
            queryClient.setQueryData(['history', history.id], history)
          })
        })
      },
    },
  )

  const { mutate: clearAllHistory } = useMutation(clearHistoryQuery, {
    onMutate: () => {
      queryClient.refetchQueries(['history'])
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
      return <ListSkeletonLoader />
    }

    if (data) {
      const history = data.pages.map((page) => page.items).flat()

      if (history.length === 0) {
        return null
      }

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
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
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
  }, [isLoading, data, error, fetchNextPage, hasNextPage])

  return (
    <div className="flex flex-col h-full">
      <Scrollbars className="flex-1" autoHide>
        {historyContent}
      </Scrollbars>
      {data && data.pages[0].items.length > 0 ? (
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
      ) : null}
    </div>
  )
}
