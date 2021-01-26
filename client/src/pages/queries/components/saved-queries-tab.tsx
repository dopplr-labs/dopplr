import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Dropdown, Empty, Menu, Modal, Result, Spin } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { SavedQueryPage, SavedQuery as SavedQueryType } from 'types/query'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { deleteQuery, fetchSavedQueries } from '../queries-and-mutations'
import ListSkeletonLoader from './list-skeleton-loader'
import RenameQueryModal from './rename-query-modal'

export default function SavedQueriesTab() {
  const queryClient = useQueryClient()
  const {
    isLoading,
    data,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    ['saved-queries'],
    ({ pageParam }) => fetchSavedQueries(pageParam),
    {
      getNextPageParam: (lastGroup) =>
        lastGroup.meta.hasMore ? lastGroup.meta.nextPage : undefined,
      onSuccess: ({ pages }) => {
        pages.forEach((page) => {
          page.items.forEach((savedQuery) => {
            queryClient.setQueryData(
              ['saved-queries', savedQuery.id],
              savedQuery,
            )
          })
        })
      },
    },
  )

  const savedTabContent = useMemo(() => {
    if (isLoading) {
      return <ListSkeletonLoader />
    }

    if (data) {
      const savedQueries = data.pages.map((page) => page.items).flat()

      if (savedQueries.length === 0) {
        return null
      }

      return (
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
          {savedQueries.map((query) => (
            <SavedQuery query={query} key={query.id} />
          ))}
        </InfiniteScroll>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    return (
      <div className="flex items-center justify-center h-full">
        <Empty
          description={<span className="text-xs">Save your first query</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }, [isLoading, data, error, fetchNextPage, hasNextPage])

  return (
    <Scrollbars className="h-full" autoHide>
      {savedTabContent}
    </Scrollbars>
  )
}

type SavedQueryProps = {
  query: SavedQueryType
}

function SavedQuery({ query }: SavedQueryProps) {
  const [renameModalVisible, setRenameModalVisible] = useState(false)

  function handleModalRequestClose() {
    setRenameModalVisible(false)
  }

  const queryClient = useQueryClient()
  const { mutate: deleteQueryMutation } = useMutation(deleteQuery, {
    onMutate: (deletedQueryId) => {
      queryClient.setQueryData(
        ['saved-queries'],
        (savedQueries: SavedQueryPage[] | undefined) =>
          savedQueries
            ? savedQueries.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== deletedQueryId),
              }))
            : [],
      )
      queryClient.removeQueries(['saved-query', deletedQueryId])
    },
  })

  // Confirmation modal to appear when user tries to delete saved query
  const confirmDeleteSavedQuery = useCallback(() => {
    Modal.confirm({
      title: 'Delete Saved Query?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteQueryMutation(query.id)
      },
    })
  }, [query.id, deleteQueryMutation])

  // Dropdown menu options for saved query
  const savedQueryMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            setRenameModalVisible(true)
          }}
        >
          <EditOutlined />
          <span>Rename</span>
        </Menu.Item>
        <Menu.Item
          key="1"
          className="flex items-center space-x-2 text-xs"
          onClick={confirmDeleteSavedQuery}
        >
          <DeleteOutlined />
          <span>Delete</span>
        </Menu.Item>
      </Menu>
    )
  }, [confirmDeleteSavedQuery])

  return (
    <>
      <Link
        to={`/queries/saved/${query.id}`}
        className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer group hover:bg-background-primary"
        title={`${query.name}\n${query.query}`}
      >
        <div className="space-y-2 truncate">
          <div className="font-medium text-brand-primary">
            <span>{query.name}</span>
          </div>
          <div className="truncate">{query.query}</div>
        </div>
        <span
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <Dropdown overlay={savedQueryMenu} trigger={['click']}>
            <button className="invisible px-1 focus:outline-none group-hover:visible">
              <EllipsisOutlined className="text-lg" />
            </button>
          </Dropdown>
        </span>
      </Link>
      <RenameQueryModal
        visible={renameModalVisible}
        onRequestClose={handleModalRequestClose}
        queryId={query.id}
        queryName={query.name}
      />
    </>
  )
}
