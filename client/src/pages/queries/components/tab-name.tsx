import { truncate } from 'lodash-es'
import React from 'react'
import { useTabData } from '../hooks/use-tab-data'
import { TabType } from '../types'

type TabNameProps = {
  tabRoute: string
}

export default function TabName({ tabRoute }: TabNameProps) {
  const {
    isLoadingTabData,
    query,
    name,
    hasUnsavedChanges,
    tabType,
  } = useTabData(tabRoute)

  const tabName = truncate(tabType === TabType.SAVED ? name : query, {
    length: 20,
  })

  return (
    <div className="relative z-50 flex items-center space-x-2">
      {isLoadingTabData ? (
        <div className="w-20 h-4 animate-pulse bg-background-secondary" />
      ) : (
        <span className="text-xs">{tabName || 'Untitled Query'}</span>
      )}
      {hasUnsavedChanges ? (
        <div className="w-2 h-2 rounded-full bg-brand-primary" />
      ) : null}
    </div>
  )
}
