import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import invariant from 'tiny-invariant'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUERY_CHARTS, QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { QueryChartType } from '@/types/query-chart'
import { Form } from '@/components/ui/form'
import { useStore } from '@/stores'
import { EmptyMessage } from '@/components/ui/empty-message'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/client'
import { createChartInput } from '@/server/routers/charts/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import QueryChartConfigInputs from '@/app/(authenticated-app)/_components/query-chart-config-inputs'

export default function QueryChart() {
  const activeTabData = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId] : undefined,
  )
  invariant(activeTabData, 'Could not find active tab data!')
  const queryResult = activeTabData.queryResult

  const [chartSelected, setChartSelected] = useState<QueryChartType>('BAR_CHART')
  const [name, setName] = useState<string>('')

  const chartConfig = QUERY_CHARTS_CONFIG[chartSelected]
  const validationSchema = chartConfig.validationSchema

  const { toast } = useToast()
  const createChartMutation = trpc.charts.create.useMutation({
    onSuccess: () => {
      form.reset()
      toast({ title: 'Chart created successfully!' })
    },
  })

  const form = useForm({
    resolver: zodResolver(validationSchema),
  })
  const values = form.watch()
  const result = validationSchema.safeParse(values)

  const chartContent = useMemo(() => {
    if (!queryResult || queryResult.length === 0 || !result.success) {
      return (
        <div className="grid h-full w-full place-content-center">
          <EmptyMessage title="No fields selected!" description="Select all required fields to plot a chart!" />
        </div>
      )
    }

    return (
      <chartConfig.Component
        key={chartSelected}
        data={parseQueryResult(queryResult)}
        {...getConfigFromValues(chartConfig.type, result.data)}
      />
    )
  }, [queryResult, result, chartConfig, chartSelected])

  const handleChartCreate = (config: z.infer<typeof validationSchema>) => {
    try {
      const dataToSubmit = createChartInput.parse({
        name,
        config,
        query: activeTabData.query,
        resource: activeTabData.resourceId,
        type: chartSelected,
      })

      createChartMutation.mutate(dataToSubmit as z.infer<typeof createChartInput>)
    } catch (error) {
      toast({
        title: 'Invalid Config Data!',
        description: 'Invalid config data found, make sure you have selected all the required fields!',
      })
    }
  }

  if (!queryResult) {
    return (
      <div className="flex items-center justify-center space-x-1 p-8 text-sm">
        <span>Run the query</span> <span className="rounded border bg-muted p-1 font-mono text-xs">Ctrl/Cmd</span>{' '}
        <span>+</span>
        <span className="rounded border bg-muted p-1 font-mono text-xs">Enter</span>
        <span>to see results.</span>
      </div>
    )
  }

  const columns = Object.keys(queryResult.length > 0 ? queryResult[0] : {})

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="col-span-2">{chartContent}</div>
      <div className="space-y-4">
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
            placeholder="Enter name of your chart"
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChartCreate)} className="space-y-4">
            <QueryChartConfigInputs inputs={chartConfig.inputs} control={form.control} columns={columns} />

            <Button
              type="submit"
              disabled={!result.success || createChartMutation.isLoading}
              loading={createChartMutation.isLoading}
            >
              Create Chart
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
