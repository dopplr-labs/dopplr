'use client'

import { useParams } from 'next/navigation'
import { match } from 'ts-pattern'
import { Code2Icon, SaveIcon, TerminalIcon, TrashIcon } from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useCallback, useRef, useState } from 'react'
import { Monaco } from '@monaco-editor/react'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import PgEditor from '@/components/pg-editor'
import { EmptyMessage } from '@/components/ui/empty-message'
import { useToast } from '@/components/ui/use-toast'

type CodeEditor = ReturnType<Monaco['editor']['create']>

export default function ChartDetails() {
  const { id } = useParams() as { id: string }
  const { toast } = useToast()
  const [query, setQuery] = useState<string | undefined>(undefined)

  const chartDetailsQuery = trpc.charts.findOneById.useQuery(
    { id: Number(id) },
    {
      onSuccess: (data) => {
        setQuery(data.charts.query)
      },
    },
  )
  const formatQueryMutation = trpc.query.formatQuery.useMutation()

  const editorRef = useRef<CodeEditor | null>(null)

  const runQueryMutation = trpc.query.runQueryMutation.useMutation({
    onError: (error) => {
      toast({
        title: 'Error running query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
  })

  console.log(chartDetailsQuery.data)

  const handleRunQuery = useCallback(() => {
    editorRef.current?.getAction('editor.action.runQuery')?.run()
  }, [])

  return match(chartDetailsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => {
      return (
        <div className="h-full space-y-2 p-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-80" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>

          <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
            <Skeleton className="row-span-2 h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      )
    })
    .with({ status: 'error' }, ({ error }) => (
      <ErrorMessage title="Something went wrong!" description={error?.message ?? 'Chart details may not exists!'} />
    ))
    .with({ status: 'success' }, ({ data: { charts: chart, resource } }) => {
      if (!resource) {
        return (
          <EmptyMessage
            title="Resource not allocated"
            description="Something went wrong when you saved this chart, there is no resource allocated!"
          />
        )
      }

      return (
        <div className="h-full space-y-2">
          <div className="flex items-center justify-between p-2">
            <div>{chart.name}</div>

            <div className="flex items-center gap-2">
              <Button
                className="opacity-40 hover:opacity-100"
                variant="destructive-outline"
                icon={<TrashIcon className="h-4 w-4" />}
              >
                Delete
              </Button>
              <Button variant="secondary">Duplicate</Button>
              <Button icon={<SaveIcon className="h-4 w-4" />}>Save</Button>
            </div>
          </div>

          <PanelGroup direction="horizontal" className="!mt-0 border-t">
            <Panel>
              <div className="flex items-center justify-end gap-2 p-2">
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
                  onClick={handleRunQuery}
                >
                  Run Query
                </Button>
              </div>
              <PgEditor
                key={`${chart.id}-${chart.resourceId}`}
                value={chart.query}
                onChange={(value) => {
                  setQuery(value)
                }}
                resource={resource}
                format={formatQueryMutation.mutateAsync}
                runQuery={runQueryMutation.mutate}
                onMount={(editor) => {
                  editorRef.current = editor
                }}
              />
            </Panel>
            <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
            <Panel>
              <PanelGroup direction="vertical">
                <Panel>top</Panel>
                <PanelResizeHandle className="h-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
                <Panel>bottom</Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      )
    })
    .exhaustive()
}
