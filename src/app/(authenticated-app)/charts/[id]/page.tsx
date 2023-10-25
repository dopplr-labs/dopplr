'use client'

import { useParams, useRouter } from 'next/navigation'
import { match } from 'ts-pattern'
import { Code2Icon, LoaderIcon, SaveIcon, TerminalIcon, TrashIcon } from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Monaco } from '@monaco-editor/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import PgEditor from '@/components/pg-editor'
import { EmptyMessage } from '@/components/ui/empty-message'
import { useToast } from '@/components/ui/use-toast'
import { QUERY_CHARTS, QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { QueryChartType } from '@/types/query-chart'
import { Form } from '@/components/ui/form'
import QueryChartConfigInputs from '../../_components/query-chart-config-inputs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

type CodeEditor = ReturnType<Monaco['editor']['create']>

export default function ChartDetails() {
  const { id } = useParams() as { id: string }
  const { toast } = useToast()
  const router = useRouter()

  const [chartSelected, setChartSelected] = useState<QueryChartType>('BAR_CHART')
  const [query, setQuery] = useState('')
  const [name, setName] = useState<string>('')
  const utils = trpc.useContext()

  const chartConfig = QUERY_CHARTS_CONFIG[chartSelected]
  const validationSchema = chartConfig.validationSchema

  const form = useForm({
    resolver: zodResolver(validationSchema),
  })

  const values = form.watch()
  const result = validationSchema.safeParse(values)

  const chartDetailsQuery = trpc.charts.findOneById.useQuery(
    { id: Number(id) },
    {
      onSuccess: (data) => {
        form.reset(data.charts.config as Record<string, string | number>)
        setName(data.charts.name)
        setQuery(data.charts.query)
        setChartSelected(data.charts.type!)
      },
    },
  )

  const runQueryMutation = trpc.query.runQueryMutation.useMutation({
    onError: (error) => {
      toast({
        title: 'Error running query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
  })

  const updateChartMutation = trpc.charts.update.useMutation({
    onSuccess: () => {
      chartDetailsQuery.refetch()
      utils.charts.getUserCharts.invalidate()
    },
  })

  const duplicateChartMutation = trpc.charts.duplicate.useMutation({
    onSuccess: (data) => {
      utils.charts.getUserCharts.invalidate()
      toast({ title: 'Chart duplicated successfully!' })
      router.replace(`/charts/${data.id}`)
    },
  })

  const columns = Object.keys(
    runQueryMutation?.data && runQueryMutation?.data.length > 0 ? runQueryMutation.data[0] : {},
  )

  const chartContent = useMemo(() => {
    if (!runQueryMutation?.data || runQueryMutation.data?.length === 0 || !result.success) {
      return (
        <div className="grid h-full w-full place-content-center">
          <EmptyMessage title="No fields selected!" description="Select all required fields to plot a chart!" />
        </div>
      )
    }

    return (
      <chartConfig.Component
        key={chartSelected}
        data={parseQueryResult(runQueryMutation.data)}
        {...getConfigFromValues(chartConfig.type, result.data)}
      />
    )
  }, [runQueryMutation, result, chartConfig, chartSelected])

  const formatQueryMutation = trpc.query.formatQuery.useMutation()

  const editorRef = useRef<CodeEditor | null>(null)

  const handleRunQuery = useCallback(() => {
    editorRef.current?.getAction('editor.action.runQuery')?.run()
  }, [])

  const handleChartUpdate = (config: z.infer<typeof validationSchema>) => {
    updateChartMutation.mutate({
      id: Number(id),
      name,
      query,
      type: chartSelected,
      config: config as Record<string, string | number>,
    })
  }

  useEffect(
    function runQueryOnPageLoad() {
      if (chartDetailsQuery.status === 'success') {
        runQueryMutation.mutate({
          type: chartDetailsQuery.data.resource?.type!,
          connectionString: (chartDetailsQuery.data?.resource?.connectionConfig as unknown as { url: string })?.url,
          query: chartDetailsQuery?.data.charts?.query,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartDetailsQuery.status],
  )

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
              <Button
                loading={duplicateChartMutation.isLoading}
                disabled={duplicateChartMutation.isLoading}
                variant="secondary"
                onClick={() => {
                  duplicateChartMutation.mutate({ id: Number(id) })
                }}
              >
                Duplicate
              </Button>
              <Button
                loading={updateChartMutation.isLoading}
                disabled={updateChartMutation.isLoading}
                icon={<SaveIcon className="h-4 w-4" />}
                onClick={() => {
                  handleChartUpdate(values)
                }}
              >
                Save
              </Button>
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
                value={query}
                onChange={(value) => {
                  if (value) {
                    setQuery(value)
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
            <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
            <Panel>
              <PanelGroup direction="vertical">
                <Panel className="relative flex items-center justify-center">
                  {runQueryMutation.isLoading ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    chartContent
                  )}
                </Panel>
                <PanelResizeHandle className="h-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
                <Panel className="mb-14">
                  <div className="relative h-full space-y-4 overflow-y-auto p-4">
                    {runQueryMutation.isLoading ? (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div>Chart Configuration</div>
                        <Select
                          value={chartSelected}
                          onValueChange={(value) => {
                            form.reset()
                            setChartSelected(value as QueryChartType)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Chart Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {QUERY_CHARTS.map((chart) => (
                              <SelectItem key={chart.id} value={chart.id}>
                                {chart.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="space-y-1">
                          <div>Chart Name</div>
                          <Input
                            value={name}
                            placeholder="Enter name of your chart"
                            onChange={(e) => {
                              setName(e.target.value)
                            }}
                          />
                        </div>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleChartUpdate)} className="space-y-4 overflow-auto">
                            <QueryChartConfigInputs
                              inputs={chartConfig.inputs}
                              control={form.control}
                              columns={columns}
                            />
                          </form>
                        </Form>
                      </>
                    )}
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      )
    })
    .exhaustive()
}
