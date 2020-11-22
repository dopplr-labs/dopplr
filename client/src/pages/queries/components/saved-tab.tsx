import React, { useMemo } from 'react'
import { range } from 'lodash-es'
import { useQuery } from 'react-query'
import { Empty, Result, Typography } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import { fetchSavedQueries } from '../queries-and-mutations'

export default function SavedTab() {
  const { isLoading, data: savedQueries, error } = useQuery(
    ['saved-queries'],
    fetchSavedQueries,
  )

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

    if (savedQueries) {
      return (
        <>
          {savedQueries.map((query: any) => (
            <div
              key={query.id}
              className="px-3 py-2 space-y-2 font-mono text-xs border-b"
            >
              <div className="font-bold text-blue-500">
                <span>{query.name}</span>
              </div>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: true,
                  symbol: 'more',
                }}
                className="text-gray-800"
              >
                {query.query}
              </Typography.Paragraph>
            </div>
          ))}
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
  }, [isLoading, savedQueries, error])

  return (
    <Scrollbars className="h-full" autoHide>
      {savedTabContent}
    </Scrollbars>
  )
}
