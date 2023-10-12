import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUERY_CHARTS, QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { QueryChartType } from '@/types/query-chart'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useStore } from '@/stores'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyMessage } from '@/components/ui/empty-message'

export default function QueryChart() {
  const queryResult = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId]?.queryResult : undefined,
  )

  const [chartSelected, setChartSelected] = useState<QueryChartType>('bar-chart')
  const chartConfig = QUERY_CHARTS_CONFIG[chartSelected]

  const form = useForm({
    resolver: zodResolver(chartConfig.validationSchema),
  })
  const values = form.watch()

  const chartContent = useMemo(() => {
    if (!queryResult || queryResult.length === 0 || !form.formState.isValid) {
      return (
        <div className="grid h-full w-full place-content-center">
          <EmptyMessage title="No fields selected!" description="Select all required fields to plot a chart!" />
        </div>
      )
    }

    return (
      <chartConfig.Component data={parseQueryResult(queryResult)} {...getConfigFromValues(chartConfig.type, values)} />
    )
  }, [queryResult, chartConfig, values, form.formState.isValid])

  const handleChartCreate = (values: any) => {
    console.log(values)
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
    <div className="grid grid-cols-3 gap-4 overflow-y-auto p-4">
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
                        .with({ type: 'select' }, ({ label, options }) => (
                          <Select onValueChange={field.onChange} {...field}>
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
                        .exhaustive()}
                    </FormControl>
                    <FormDescription>{input.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </div>
    </div>
  )
}
