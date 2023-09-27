'use client'

import { Code2Icon, SaveIcon, TerminalIcon } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { match } from 'ts-pattern'
import { Monaco } from '@monaco-editor/react'
import { z } from 'zod'
import PgEditor from '@/components/pg-editor'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import ResourceSelector from './resource-selector'
import { useStore } from '@/stores'
import { TabDataStatus } from '@/types/tab'

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

  const createHistoryMutation = trpc.history.create.useMutation({})

  const runQueryMutation = trpc.query.runQueryMutation.useMutation({
    onError: (error) => {
      toast({
        title: 'Error running query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      if (activeQueryTabData && getResourceQuery.data) {
        createHistoryMutation.mutate({
          query: activeQueryTabData.query,
          resource: getResourceQuery.data.id,
        })
      }
    },
  })

  const handleRunQuery = useCallback(() => {
    editorRef.current?.getAction('editor.action.runQuery')?.run()
  }, [])

  useEffect(
    function registerRunQueryEventListener() {
      if (typeof document !== 'undefined') {
        function handler(event: CustomEvent) {
          try {
            const tabId = z.object({ tabId: z.string() }).parse(event.detail).tabId
            if (tabId === activeQueryTabId) {
              handleRunQuery()
            }
          } catch (error) {}
        }

        document.addEventListener('run-query', handler)

        return () => {
          document.removeEventListener('run-query', handler)
        }
      }
    },
    [activeQueryTabId, handleRunQuery],
  )

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
        <Button icon={<TerminalIcon />} variant="outline" loading={runQueryMutation.isLoading} onClick={handleRunQuery}>
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
          <div className="h-full origin-left animate-progress-bar bg-muted-foreground" />
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
          .with({ status: 'success' }, ({ data: resource }) => {
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
                          dataStatus: TabDataStatus.UNSAVED,
                        })
                      }
                    }}
                    resource={resource}
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
