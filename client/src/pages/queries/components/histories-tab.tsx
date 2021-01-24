import React, { useCallback, useMemo, useState } from 'react'
import { Button, Dropdown, Empty, Menu, Modal, Result, Spin } from 'antd'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'
import InfiniteScroll from 'react-infinite-scroller'
import Scrollbars from 'react-custom-scrollbars'
import { useMutation, useInfiniteQuery, useQueryClient } from 'react-query'
import {
  DeleteOutlined,
  DownOutlined,
  EllipsisOutlined,
  RightOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { History, HistoryPage } from 'types/history'
import { Link } from 'react-router-dom'
import {
  clearHistoryQuery,
  deleteQuery,
  fetchHistories,
} from '../queries-and-mutations'
import ListSkeletonLoader from './list-skeleton-loader'
import SaveQueryModal from './save-query-modal'

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

type DayHistoryProps = {
  singleDayHistory: History[]
  date: string
}

function DayHistory({ singleDayHistory, date }: DayHistoryProps) {
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

type HistoryQueryProps = { query: History }

function HistoryQuery({ query }: HistoryQueryProps) {
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  function handleModalRequestClose() {
    setSaveModalVisible(false)
  }

  const queryClient = useQueryClient()
  const { mutate: deleteQueryMutation } = useMutation(deleteQuery, {
    onMutate: (deletedQueryId) => {
      queryClient.setQueryData(
        ['history'],
        (history: HistoryPage[] | undefined) =>
          history
            ? history.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== deletedQueryId),
              }))
            : [],
      )
      queryClient.removeQueries(['history', deletedQueryId])
    },
  })

  const historyMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            setSaveModalVisible(true)
          }}
        >
          <SaveOutlined />
          <span>Save Query</span>
        </Menu.Item>
        <Menu.Item
          key="1"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            deleteQueryMutation(query.id)
          }}
        >
          <DeleteOutlined />
          <span>Clear</span>
        </Menu.Item>
      </Menu>
    )
  }, [deleteQueryMutation, query.id])

  return (
    <>
      <Link
        className="flex items-center justify-between py-1 pl-8 pr-3 space-x-1 text-xs cursor-pointer hover:bg-background-primary group"
        to={`/queries/history/${query.id}`}
      >
        <div className="w-full text-xs truncate" title={query.query}>
          {query.query}
        </div>
        <span
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <Dropdown overlay={historyMenu} trigger={['click']}>
            <button className="invisible px-1 focus:outline-none group-hover:visible">
              <EllipsisOutlined className="text-lg" />
            </button>
          </Dropdown>
        </span>
      </Link>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={handleModalRequestClose}
        resourceId={query.resource.id}
        query={query.query}
      />
    </>
  )
}
