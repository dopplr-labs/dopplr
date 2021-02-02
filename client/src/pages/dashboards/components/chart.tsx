import React, { cloneElement, useMemo } from 'react'
import { useQuery } from 'react-query'
import { fetchChart } from 'pages/queries/chart-queries'
import { runQuery } from 'pages/queries/queries-and-mutations'
import { chartList } from 'pages/queries/data/chart-list'
import { EllipsisOutlined } from '@ant-design/icons'

type ChartProps = {
  chartId: string
}

export default function Chart({ chartId }: ChartProps) {
  const { data: chart, isLoading } = useQuery(['chart', chartId], () =>
    fetchChart(parseInt(chartId)),
  )

  const { data: queryResult, isLoading: isRunningQuery } = useQuery(
    ['query', chart?.query.id],
    () =>
      runQuery({
        resource: chart?.query.resource.id ?? 0,
        query: chart?.query.query ?? '',
      }),
    { enabled: !isLoading },
  )

  const chartContent = useMemo(() => {
    if (isLoading || isRunningQuery) {
      return (
        <>
          <div className="w-1/2 h-6 bg-background-secondary animate-pulse" />
          <div className="w-full h-full bg-background-secondary animate-pulse" />
        </>
      )
    }

    if (chart && queryResult) {
      const chartData = chart.values
        .map((value) =>
          queryResult.rows.map((row) => {
            return { label: row[chart.label], value: row[value], type: value }
          }),
        )
        .flat()
      return (
        <>
          <div className="text-xs text-gray-700">{chart.name}</div>
          <div className="w-full h-full">
            {cloneElement(chartList[chart.type].chart, { data: chartData })}
          </div>
        </>
      )
    }
  }, [isLoading, isRunningQuery, chart, queryResult])

  return (
    <div className="relative flex flex-col items-start h-full p-4 space-y-2 shadow-md">
      {chartContent}
      <button className="absolute top-0 right-0 px-2 py-1 mr-2 focus:outline-none">
        <EllipsisOutlined />
      </button>
    </div>
  )
}
