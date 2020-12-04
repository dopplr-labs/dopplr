import React, { useContext, useEffect } from 'react'
import { Result } from 'antd'
import clsx from 'clsx'
import { QueryTabsContext } from 'contexts/query-tabs-context'
import { fetchResources } from 'pages/resources/queries'
import { useQuery } from 'react-query'
import { Tab, TabType } from 'types/tab'
import QueryEditor from './query-editor'

type QueryTabProps = {
  tab: Tab
  className?: string
  style?: React.CSSProperties
}

export default function QueryTab({ tab, className, style }: QueryTabProps) {
  const { id, type, data: tabData } = tab
  const { updateTab } = useContext(QueryTabsContext)

  const { isLoading, data: resources, error } = useQuery(
    ['resources'],
    fetchResources,
  )

  useEffect(() => {
    if (
      resources &&
      resources.length > 0 &&
      !tabData.resource &&
      type === TabType.UNSAVED
    ) {
      updateTab({ id, type, data: { resource: resources[0] } })
    }
  }, [resources, tabData.resource, type, id, updateTab])

  if (isLoading) {
    return (
      <div
        className={clsx('flex h-full px-4 space-x-4', className)}
        style={style}
      >
        <div className="flex-1 py-4 space-y-4">
          <div className="w-full bg-gray-200 h-80 animate-pulse" />
          <div className="w-full h-40 bg-gray-200 animate-pulse" />
        </div>
        <div className="py-4 space-y-4 w-80">
          <div className="w-full h-8 bg-gray-200 animate-pulse" />
          <div className="w-full h-8 bg-gray-200 animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="warning"
        subTitle={(error as any).message}
        className={className}
        style={style}
      />
    )
  }

  if (resources && tab) {
    return (
      <div className={clsx('flex h-full', className)} style={style}>
        <QueryEditor className="flex-1" resources={resources} tab={tab} />
      </div>
    )
  }

  return null
}
