'use client'

import { useMemo } from 'react'
import { Code2Icon, TerminalIcon } from 'lucide-react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import PgEditor from '@/components/pg-editor'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function QueriesPage() {
  const getResourceQuery = trpc.resource.getResources.useQuery()

  const content = useMemo(() => {
    if (getResourceQuery.isLoading) {
      return <Skeleton className="h-full rounded-none" />
    }

    if (getResourceQuery.data) {
      return (
        <PanelGroup direction="vertical" units="pixels">
          <Panel>
            <PgEditor resource={getResourceQuery.data[0]} />
          </Panel>
          <PanelResizeHandle className="h-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
          <Panel defaultSize={240} minSize={200} maxSize={360} />
        </PanelGroup>
      )
    }

    return null
  }, [getResourceQuery])

  return (
    <PanelGroup direction="horizontal" className="h-full" units="pixels">
      <Panel maxSize={360} minSize={180} defaultSize={240} />
      <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
      <Panel className="flex flex-1 flex-col">
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
        </div>
        <div className="flex-1">{content}</div>
      </Panel>
    </PanelGroup>
  )
}
