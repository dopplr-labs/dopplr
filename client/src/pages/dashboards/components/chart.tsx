import React, { cloneElement, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { EllipsisOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Modal } from 'antd'
import { chartList } from 'pages/queries/data/chart-list'
import { runQuery } from 'pages/queries/queries-and-mutations'
import { fetchDashboardChart } from '../queries'

type ChartProps = {
  dashboardChartId: number
}

export default function Chart({ dashboardChartId }: ChartProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

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

  function handleEnterFullScreen() {
    setIsFullScreen(true)
  }

  function handleExitFullScreen() {
    setIsFullScreen(false)
  }

  const chartMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item key="0" className="text-xs">
          Remove from Dashboard
        </Menu.Item>
      </Menu>
    ),
    [],
  )

  const chartContent = useMemo(() => {
    if (isLoading || isRunningQuery) {
      return (
        <>
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
        <div className="w-full h-full">
          {cloneElement(chartList[dashboardChart.chart.type].chart, {
            data: chartData,
          })}
        </div>
      )
    }
  }, [isLoading, isRunningQuery, dashboardChart, queryResult])

  return (
    <>
      <div className="relative flex flex-col items-start h-full p-4 space-y-4 bg-white shadow-md group">
        {isLoading || isRunningQuery ? (
          <div className="w-1/2 h-6 bg-background-secondary animate-pulse" />
        ) : (
          dashboardChart && (
            <div className="text-sm font-medium text-gray-600">
              {dashboardChart.chart.name}
            </div>
          )
        )}
        {chartContent}
        <Dropdown overlay={chartMenu} trigger={['click']}>
          <button className="absolute top-0 right-0 invisible px-2 py-1 mr-2 focus:outline-none group-hover:visible">
            <EllipsisOutlined />
          </button>
        </Dropdown>
        <button
          className="absolute top-0 right-0 invisible px-2 py-1 mr-8 focus:outline-none group-hover:visible"
          onClick={handleEnterFullScreen}
        >
          <FullscreenOutlined />
        </button>
      </div>

      <Modal
        visible={isFullScreen}
        title={dashboardChart?.chart.name}
        onCancel={handleExitFullScreen}
        cancelText="Close"
        width={1960}
        footer={<Button onClick={handleExitFullScreen}>Close</Button>}
      >
        <div className="relative flex flex-col items-start p-4 space-y-4 bg-white h-120">
          {chartContent}
        </div>
      </Modal>
    </>
  )
}
