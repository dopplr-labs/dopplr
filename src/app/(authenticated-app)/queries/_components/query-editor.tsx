'use client'

import { Code2Icon, SaveIcon, TerminalIcon } from 'lucide-react'
import { useRef } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { match } from 'ts-pattern'
import { Monaco } from '@monaco-editor/react'
import PgEditor from '@/components/pg-editor'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import ResourceSelector from './resource-selector'
import { useStore } from '@/stores'

type CodeEditor = ReturnType<Monaco['editor']['create']>

export default function QueryEditor() {
  const activeQueryTabId = useStore((store) => store.activeQueryTabId)
  const activeQueryTabData = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId] : undefined,
  )
  const updateQueryTabData = useStore((store) => store.updateQueryTabData)

  const getResourceQuery = trpc.resource.getResource.useQuery(
    {
      id: activeQueryTabData?.resourceId!,
    },
    {
      enabled: !!activeQueryTabData?.resourceId,
    },
  )

  const { toast } = useToast()

  const editorRef = useRef<CodeEditor | null>(null)

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
    <>
      <div className="flex items-center space-x-4 border-b px-4 py-2">
        <ResourceSelector />
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
          .with({ status: 'error' }, ({ error }) => (
            <ErrorMessage
              title="Error fetching resource"
              description={error.message ?? 'Something went wrong. Please try again'}
            />
          ))
          .with({ status: 'success' }, ({ data }) => {
            return (
              <PanelGroup direction="vertical">
                <Panel defaultSize={60}>
                  <PgEditor
                    key={`${activeQueryTabData?.resourceId}-${activeQueryTabData?.tabId}-${activeQueryTabData?.savedQueryId}`}
                    value={activeQueryTabData?.query}
                    onChange={(value) => {
                      if (value && activeQueryTabId) {
                        updateQueryTabData(activeQueryTabId, {
                          query: value,
                        })
                      }
                    }}
                    resource={data}
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
    </>
  )
}
