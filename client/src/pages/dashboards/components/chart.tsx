import { EllipsisOutlined } from '@ant-design/icons'
import { chartList } from 'pages/queries/data/chart-list'
import { runQuery } from 'pages/queries/queries-and-mutations'
import React, { cloneElement, useMemo } from 'react'
import { useQuery } from 'react-query'
import { fetchDashboardChart } from '../queries'

type ChartProps = {
  dashboardChartId: number
}

export default function Chart({ dashboardChartId }: ChartProps) {
  const { data: dashboardChart, isLoading } = useQuery(
    ['dashboard-chart', dashboardChartId],
    () => fetchDashboardChart(dashboardChartId),
  )

  const { data: queryResult, isLoading: isRunningQuery } = useQuery(
    ['query', dashboardChart?.chart.query.id],
    () =>
      runQuery({
        resource: dashboardChart?.chart.query.resource.id ?? 0,
        query: dashboardChart?.chart.query.query ?? '',
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
    if (dashboardChart && queryResult) {
      const chartData = dashboardChart.chart.values
        .map((value) =>
          queryResult.rows.map((row) => {
            return {
              label: row[dashboardChart.chart.label],
              value: row[value],
              type: value,
            }
          }),
        )
        .flat()
      return (
        <>
          <div className="text-xs text-gray-700">
            {dashboardChart.chart.name}
          </div>
          <div className="w-full h-full">
            {cloneElement(chartList[dashboardChart.chart.type].chart, {
              data: chartData,
            })}
          </div>
        </>
      )
    }
  }, [isLoading, isRunningQuery, dashboardChart, queryResult])

  return (
    <div className="relative flex flex-col items-start h-full p-4 space-y-2 bg-white shadow-md">
      {chartContent}
      <button className="absolute top-0 right-0 px-2 py-1 mr-2 focus:outline-none">
        <EllipsisOutlined />
      </button>
    </div>
  )
}
