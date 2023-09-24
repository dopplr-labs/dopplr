'use client'

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import Link from 'next/link'
import { useEffect } from 'react'
import { match } from 'ts-pattern'
import SidePanel from './_components/side-panel'
import QueryTabs from './_components/query-tabs'
import QueryEditor from './_components/query-editor'
import { trpc } from '@/lib/trpc/client'
import { EmptyMessage } from '@/components/ui/empty-message'
import { BaseButton } from '@/components/ui/button'
import { useStore } from '@/stores'
import { generateRandomId, range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@/components/ui/error-message'

export default function QueriesPage() {
  const getReourcesQuery = trpc.resource.getResources.useQuery()
  const activeQueryTabId = useStore((store) => store.activeQueryTabId)
  const addQueryTab = useStore((store) => store.addQueryTab)

  useEffect(
    function createTabIfNotPresent() {
      if (getReourcesQuery.isSuccess && getReourcesQuery.data.length && !activeQueryTabId) {
        const tabId = generateRandomId(16)
        addQueryTab(tabId, getReourcesQuery.data[0].id)
      }
    },
    [addQueryTab, activeQueryTabId, getReourcesQuery],
  )

  return match(getReourcesQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => (
      <div className="flex h-full">
        <div className="flex-[25] border-r p-4">
          <Skeleton className="mb-4 h-8" />
          <Skeleton className="h-8 w-7/12" />
        </div>
        <div className="flex flex-[75] flex-col">
          <div className="flex items-center space-x-2 border-b p-2">
            {range(3).map((key) => (
              <Skeleton className="h-6 w-20" key={key} />
            ))}
          </div>
          <div className="flex items-center space-x-2 border-b p-2">
            <Skeleton className="h-9 w-64" />
            <div className="flex-1" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="flex-[60] rounded-none border-b" />
          <div className="flex-[40]" />
        </div>
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex h-full items-center justify-center">
        <ErrorMessage
          title="Error fetching data"
          description={error.message ?? 'Something went wrong. Please try again later.'}
        />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => {
      if (data.length === 0) {
        return (
          <div className="flex h-full items-center justify-center">
            <EmptyMessage
              title="No resources found"
              description={
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div>Please create a resource before creating a query</div>
                  <BaseButton variant="secondary" asChild size="sm">
                    <Link href="/resources">Create Resource</Link>
                  </BaseButton>
                </div>
              }
            />
          </div>
        )
      }

      if (!activeQueryTabId) {
        return null
      }

      return (
        <PanelGroup direction="horizontal" className="h-full overflow-hidden">
          <Panel maxSize={40} minSize={20} defaultSize={25}>
            <SidePanel />
          </Panel>
          <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
          <Panel className="flex flex-col" defaultSize={75}>
            <QueryTabs className="border-b" />
            <QueryEditor resourceId={3} tempId="foo" />
          </Panel>
        </PanelGroup>
      )
    })
    .exhaustive()
}
