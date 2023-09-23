'use client'

import { useRef } from 'react'
import { Code2Icon, SaveIcon, TerminalIcon } from 'lucide-react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { match } from 'ts-pattern'
import { Monaco } from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import PgEditor from '@/components/pg-editor'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import SidePanel from './_components/side-panel'
import QueryTabs from './_components/query-tabs'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type CodeEditor = ReturnType<Monaco['editor']['create']>

export default function QueriesPage() {
  const { toast } = useToast()
  const editorRef = useRef<CodeEditor | null>(null)

  const getResourceQuery = trpc.resource.getResources.useQuery()

  const formatQueryMutation = trpc.query.formatQuery.useMutation()

  const runQueryMutation = trpc.query.runQueryMutation.useMutation({
    onError: (error) => {
      toast({
        title: 'Error running query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
  })

  return (
    <PanelGroup direction="horizontal" className="h-full overflow-hidden">
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
          <Button
            icon={<Code2Icon />}
            variant="ghost"
            loading={formatQueryMutation.isLoading}
            onClick={() => {
              editorRef.current?.getAction('editor.action.formatDocument')?.run()
            }}
          >
            Format
          </Button>
          <Button
            icon={<TerminalIcon />}
            variant="outline"
            loading={runQueryMutation.isLoading}
            onClick={() => {
              editorRef.current?.getAction('editor.action.runQuery')?.run()
            }}
          >
            Run Query
          </Button>
          <Button
            icon={<SaveIcon />}
            variant="outline"
            onClick={() => {
              toast({
                title: 'Save Query',
                description: 'Not yet implemented. Please come back later.',
              })
            }}
          >
            Save Query
          </Button>
        </div>
        <div className="relative flex-1">
          <div
            className={cn(
              'pointer-events-none absolute left-0 right-0 top-0 z-10 h-0.5 w-full bg-muted',
              runQueryMutation.isLoading ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className="animate-progress-bar h-full origin-left bg-muted-foreground" />
          </div>
          {match(getResourceQuery)
            .returnType<React.ReactNode>()
            .with({ status: 'loading' }, () => <Skeleton className="h-full rounded-none" />)
            .with({ status: 'error' }, () => null)
            .with({ status: 'success' }, ({ data }) => {
              return (
                <PanelGroup direction="vertical">
                  <Panel defaultSize={60}>
                    <PgEditor
                      resource={data[0]}
                      format={formatQueryMutation.mutateAsync}
                      runQuery={runQueryMutation.mutate}
                      onMount={(editor) => {
                        editorRef.current = editor
                      }}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
                  <Panel defaultSize={40} minSize={30} maxSize={60} />
                </PanelGroup>
              )
            })
            .exhaustive()}
        </div>
      </Panel>
    </PanelGroup>
  )
}
