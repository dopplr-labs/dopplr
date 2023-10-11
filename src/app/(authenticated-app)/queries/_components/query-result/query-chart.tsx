import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUERY_CHARTS, QUERY_CHARTS_CONFIG, getConfigFromValues, isFormValid } from '@/lib/query-chart/utils'
import { QueryChartType } from '@/types/query-chart'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useStore } from '@/stores'

export default function QueryChart() {
  const queryResult = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId]?.queryResult : undefined,
  )

  const [chartSelected, setChartSelected] = useState<QueryChartType>('pie-chart')
  const chartConfig = QUERY_CHARTS_CONFIG[chartSelected]

  const form = useForm()
  const values = form.watch()

  const chartContent = useMemo(() => {
    if (!queryResult || queryResult.length === 0 || !isFormValid(chartConfig.inputs, values)) {
      return null
    }

    return <chartConfig.Component data={queryResult} {...getConfigFromValues(chartConfig.type, values)} />
  }, [queryResult, chartConfig, values])

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
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="col-span-2">{chartContent}</div>
      <div className="space-y-4">
        <Select
          value={chartSelected}
          onValueChange={(value) => {
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
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      {match(input)
                        .returnType<React.ReactNode>()
                        .with({ type: 'col-select' }, () => {
                          return (
                            <Select onValueChange={field.onChange} {...field}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${input.label}`} />
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
                        .exhaustive()}
                    </FormControl>
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
