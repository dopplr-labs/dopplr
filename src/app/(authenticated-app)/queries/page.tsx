'use client'

import { useMemo } from 'react'
import { Code2Icon, SaveIcon, TerminalIcon } from 'lucide-react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import PgEditor from '@/components/pg-editor'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import SidePanel from './_components/side-panel'
import QueryTabs from './_components/query-tabs'

export default function QueriesPage() {
  const getResourceQuery = trpc.resource.getResources.useQuery()

  const content = useMemo(() => {
    if (getResourceQuery.isLoading) {
      return <Skeleton className="h-full rounded-none" />
    }

    if (getResourceQuery.data) {
      return (
        <PanelGroup direction="vertical">
          <Panel defaultSize={60}>
            <PgEditor resource={getResourceQuery.data[0]} />
          </Panel>
          <PanelResizeHandle className="h-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
          <Panel defaultSize={40} minSize={30} maxSize={60} />
        </PanelGroup>
      )
    }

    return null
  }, [getResourceQuery])

  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel maxSize={40} minSize={20} defaultSize={25}>
        <SidePanel />
      </Panel>
      <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
      <Panel className="flex flex-col" defaultSize={75}>
        <QueryTabs className="border-b" />
        <div className="flex items-center space-x-4 border-b px-4 py-2">
          {getResourceQuery.data ? (
            <Select value={`resource-${getResourceQuery.data[0].id}`}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Resource" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {getResourceQuery.data.map((resource) => {
                  return (
                    <SelectItem value={`resource-${resource.id}`} key={resource.id}>
                      {resource.name}
                    </SelectItem>
                  )
                })}
                <SelectSeparator />
                <SelectItem value="resource-new">Create New Resource</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
          <div className="flex-1" />
          <Button icon={<Code2Icon />} variant="ghost">
            Format
          </Button>
          <Button icon={<TerminalIcon />} variant="outline">
            Run Query
          </Button>
          <Button icon={<SaveIcon />} variant="outline">
            Save Query
          </Button>
        </div>
        <div className="flex-1">{content}</div>
      </Panel>
    </PanelGroup>
  )
}
