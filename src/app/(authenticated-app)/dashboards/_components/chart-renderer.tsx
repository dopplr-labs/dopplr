import { useEffect, useMemo } from 'react'
import { EditIcon, LoaderIcon, MoreVerticalIcon, PinOffIcon } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { type Chart } from '@/db/schema/charts'
import { QUERY_CHARTS_CONFIG, getConfigFromValues, parseQueryResult } from '@/lib/query-chart/utils'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type ChartRendererProps = {
  className?: string
  style?: React.CSSProperties
  chart: Chart
  dashboardId: number
}

export default function ChartRenderer({ className, style, chart, dashboardId }: ChartRendererProps) {
  const chartConfig = QUERY_CHARTS_CONFIG[chart.type!]
  const { toast } = useToast()
  const utils = trpc.useContext()

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

  const removeFromDashboardMutation = trpc.charts.removeFromDashboard.useMutation({
    onError: (error) => {
      toast({
        title: 'Error while removing!',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      utils.dashboards.findOneWithCharts.invalidate()
      toast({ title: 'Chart removed successfully!' })
    },
  })

  const chartContent = useMemo(() => {
    if (!runQueryMutation?.data || runQueryMutation.data?.length === 0) {
      return (
        <div className="grid h-full w-full place-content-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      )
    }

    return (
      <chartConfig.Component
        data={parseQueryResult(runQueryMutation.data)}
        {...getConfigFromValues(chartConfig.type, chart.config as Record<string, any>, runQueryMutation?.data)}
        style={{
          height: 'calc(100% - 2rem)',
        }}
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
    <div className={cn('h-full w-full overflow-hidden rounded-md border bg-background p-4', className)} style={style}>
      <div className="mb-2 flex h-[2rem] justify-between">
        <div>
          <h1 className="truncate text-sm font-medium">{chart.name}</h1>
          {!!chart.description && <p className="truncate text-xs text-muted-foreground">{chart.description}</p>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={<MoreVerticalIcon />} variant="ghost" size="icon-sm" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href={`/charts/${chart.id}`}>
                <EditIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                removeFromDashboardMutation.mutate({ chartId: chart.id, dashboardId })
              }}
            >
              <PinOffIcon className="mr-2 h-4 w-4" />
              <span>Remove From Dashboard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {chartContent}
    </div>
  )
}
