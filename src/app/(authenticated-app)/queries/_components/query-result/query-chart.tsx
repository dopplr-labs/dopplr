import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import invariant from 'tiny-invariant'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUERY_CHARTS, QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { QueryChartType } from '@/types/query-chart'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useStore } from '@/stores'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyMessage } from '@/components/ui/empty-message'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { trpc } from '@/lib/trpc/client'
import { createChartInput } from '@/server/routers/charts/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function QueryChart() {
  const activeTabData = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId] : undefined,
  )
  invariant(activeTabData, 'Could not find active tab data!')
  const queryResult = activeTabData.queryResult

  const [chartSelected, setChartSelected] = useState<QueryChartType>('bar-chart')
  const chartConfig = QUERY_CHARTS_CONFIG[chartSelected]
  const validationSchema = chartConfig.validationSchema.extend({
    name: z.string(),
  })

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

  const handleChartCreate = ({ name, ...config }: z.infer<typeof validationSchema>) => {
    const dataToSubmit: z.infer<typeof createChartInput> = {
      name: name!,
      config,
      query: activeTabData.query,
      resource: activeTabData.resourceId,
    }

    createChartMutation.mutate(dataToSubmit)
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChartCreate)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name of your chart" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {chartConfig.inputs.map((input) => (
              <FormField
                key={input.key}
                control={form.control}
                name={input.key}
                render={({ field }) => (
                  <FormItem>
                    {input.type !== 'boolean' ? <FormLabel>{input.label}</FormLabel> : null}
                    <FormControl>
                      {match(input)
                        .returnType<React.ReactNode>()
                        .with({ type: 'col-select' }, ({ label }) => {
                          return (
                            <Select onValueChange={field.onChange} {...field}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {columns.map((column) => (
                                  <SelectItem key={column} value={column}>
                                    {column}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )
                        })
                        .with({ type: 'boolean' }, ({ key, label, defaultValue }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              defaultChecked={defaultValue}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor={key}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {label}
                            </label>
                          </div>
                        ))
                        .with({ type: 'select' }, ({ label, options, defaultValue }) => (
                          <Select defaultValue={defaultValue} onValueChange={field.onChange} {...field}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`Select ${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))
                        .with({ type: 'number' }, ({ label, defaultValue }) => (
                          <Input type="number" placeholder={label} defaultValue={defaultValue} {...field} />
                        ))
                        .with({ type: 'slider' }, ({ min, max, step, defaultValue }) => (
                          <Slider
                            defaultValue={[defaultValue]}
                            min={min}
                            max={max}
                            step={step}
                            onValueChange={field.onChange}
                            {...field}
                          />
                        ))
                        .exhaustive()}
                    </FormControl>
                    <FormDescription>{input.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

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
