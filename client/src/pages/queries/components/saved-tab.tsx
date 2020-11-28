import React, { useContext, useMemo } from 'react'
import { range } from 'lodash-es'
import { useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { Empty, Result, Spin } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { QueryTabsContext } from 'contexts/query-tabs-context'
import { TabType } from 'types/tab'
import { fetchSavedQueries } from '../queries-and-mutations'

export default function SavedTab() {
  const { isLoading, data, fetchMore, error } = useInfiniteQuery(
    ['saved-queries'],
    fetchSavedQueries,
    { getFetchMore: (lastGroup) => lastGroup.meta.nextPage },
  )

  const { openInTab } = useContext(QueryTabsContext)

  const savedTabContent = useMemo(() => {
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
            <div
              key={query.id}
              className="px-3 py-2 space-y-2 text-xs cursor-pointer hover:bg-gray-100"
              title={`${query.name}\n${query.query}`}
              onClick={() => {
                openInTab({
                  type: TabType.SAVED_QUERY,
                  data: query,
                })
              }}
            >
              <div className="font-medium text-blue-500">
                <span>{query.name}</span>
              </div>
              <div className="truncate">{query.query}</div>
            </div>
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
  }, [isLoading, data, error, fetchMore, openInTab])

  return (
    <Scrollbars className="h-full" autoHide>
      {savedTabContent}
    </Scrollbars>
  )
}
