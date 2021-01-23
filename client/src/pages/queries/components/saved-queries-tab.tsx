import React, { useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Empty, Result, Spin } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { SavedQuery } from 'types/query'
import { fetchSavedQueries } from '../queries-and-mutations'
import SingleSavedQuery from './single-saved-query'
import ListSkeletonLoader from './list-skeleton-loader'

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
          {savedQueries.map((query: SavedQuery) => (
            <SingleSavedQuery query={query} key={query.id} />
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
