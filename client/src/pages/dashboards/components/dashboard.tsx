import React, { useCallback, useMemo } from 'react'
import { Result } from 'antd'
import { SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
import GridLayout from 'react-grid-layout'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import useMeasure from 'react-use-measure'
import { fetchDashboard, updateDashboard } from '../queries'
import Chart from './chart'

export default function Dashboard() {
  const { dashboardId } = useParams()
  const [measureContainer, containerBounds] = useMeasure()

  const { data: dashboard, isLoading } = useQuery(
    ['dashboard', dashboardId],
    () => fetchDashboard(parseInt(dashboardId)),
  )

  const { mutate: editDashboard } = useMutation(updateDashboard)

  const handleUpdateDashboard = useCallback(
    (layout) => {
      editDashboard({ id: parseInt(dashboardId), layout })
    },
    [dashboardId, editDashboard],
  )

  const dashboardContent = useMemo(() => {
    if (isLoading) {
      return <div />
    }

    if (!dashboard) {
      return (
        <Result
          status="404"
          title="Not Available"
          subTitle="The dashboard you are looking for is not available"
        />
      )
    }

    if (dashboard) {
      return (
        <div className="w-full" ref={measureContainer}>
          <div className="flex items-center justify-start py-2 mx-2 -mt-6 space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-brand-primary">
                {dashboard.name}
              </span>
              <span className="text-xs text-gray-500">
                {dashboard.description}
              </span>
            </div>
            <div className="flex-1" />
            <button className="flex items-center justify-center p-2 text-lg text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <SettingOutlined />
            </button>
            <button className="flex items-center justify-center p-2 text-lg text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <ShareAltOutlined />
            </button>
          </div>
          <GridLayout
            layout={dashboard?.layout}
            rowHeight={80}
            cols={12}
            width={containerBounds.width}
            onResizeStop={handleUpdateDashboard}
            onDragStop={handleUpdateDashboard}
          >
            {dashboard.charts?.map((chart) => (
              <div key={chart.id}>
                <Chart dashboardChartId={chart.id} />
              </div>
            ))}
          </GridLayout>
        </div>
      )
    }
  }, [
    dashboard,
    isLoading,
    measureContainer,
    containerBounds.width,
    handleUpdateDashboard,
  ])

  return <>{dashboardContent}</>
}
