import React, { useMemo } from 'react'
import { range } from 'lodash-es'
import { queryCache, useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Empty, Result, Spin } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { Link } from 'react-router-dom'
import { fetchSavedQueries } from '../queries-and-mutations'

export default function SavedQueriesTab() {
  const { isLoading, data, fetchMore, error } = useInfiniteQuery(
    ['saved-queries'],
    fetchSavedQueries,
    {
      getFetchMore: (lastGroup) => lastGroup.meta.nextPage,
      onSuccess: (pages) => {
        pages.forEach((page) => {
          page.items.forEach((savedQuery) => {
            queryCache.setQueryData(
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
      const savedQueries = data
        .map((page) => page.items)
        .reduce((prev, curr) => prev.concat(curr))

      return (
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
          {savedQueries.map((query: any) => (
            <Link
              to={`saved/${query.id}`}
              key={query.id}
              className="block px-3 py-2 space-y-2 text-xs cursor-pointer hover:bg-gray-100"
              title={`${query.name}\n${query.query}`}
            >
              <div className="font-medium text-blue-500">
                <span>{query.name}</span>
              </div>
              <div className="truncate">{query.query}</div>
            </Link>
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
          description={<span className="text-xs">Run your first query</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }, [isLoading, data, error, fetchMore])

  return (
    <Scrollbars className="h-full" autoHide>
      {savedTabContent}
    </Scrollbars>
  )
}
