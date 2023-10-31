import { useEffect, useMemo } from 'react'
import { LoaderIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { type Chart } from '@/db/schema/charts'
import { QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'

type ChartRendererProps = {
  className?: string
  style?: React.CSSProperties
  chart: Chart
}

export default function ChartRenderer({ className, style, chart }: ChartRendererProps) {
  const chartConfig = QUERY_CHARTS_CONFIG[chart.type!]
  const { toast } = useToast()

  const chartDetailsQuery = trpc.charts.findOneById.useQuery({ id: chart.id })

  const runQueryMutation = trpc.query.runQueryMutation.useMutation({
    onError: (error) => {
      toast({
        title: 'Error running query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
  })

  const chartContent = useMemo(() => {
    if (!runQueryMutation?.data || runQueryMutation.data?.length === 0) {
      return (
        <div className="grid h-96 w-full place-content-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      )
    }

    return (
      <chartConfig.Component
        className="h-full w-full"
        data={parseQueryResult(runQueryMutation.data)}
        {...getConfigFromValues(chartConfig.type, chart.config as Record<string, any>, runQueryMutation?.data)}
      />
    )
  }, [runQueryMutation, chartConfig, chart])

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

  return (
    <div className={cn('h-full w-full rounded-md border p-4', className)} style={style}>
      <h1>{chart.name}</h1>
      <div className="my-2 h-[1px] w-full bg-muted" />

      {chartContent}
    </div>
  )
}
