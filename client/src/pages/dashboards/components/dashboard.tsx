import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import GridLayout from 'react-grid-layout'
import useMeasure from 'react-use-measure'
import { Result } from 'antd'
import { SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
import usePersistedSetState from 'hooks/use-persisted-state'
import { dashboardList, layout } from '../data/dashboard-data'
import Chart from './chart'

export default function Dashboard() {
  const { dashboardId } = useParams()
  const [measureContainer, containerBounds] = useMeasure()
  const [gridLayout, setGridLayout] = usePersistedSetState('layout', layout)

  const dashboardData =
    dashboardList[
      dashboardList.findIndex((dashboard) => dashboard.id === dashboardId)
    ]

  const chartIds = useMemo(() => ['24', '23', '22'], [])

  const dashboardContent = useMemo(() => {
    if (!dashboardData) {
      return (
        <Result
          status="404"
          title="Not Available"
          subTitle="The dashboard you are looking for is not available"
        />
      )
    }

    if (dashboardData) {
      return (
        <div className="w-full" ref={measureContainer}>
          <div className="flex items-center justify-start py-2 mx-2 -mt-6 space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-brand-primary">
                {dashboardData.name}
              </span>
              <span className="text-xs text-gray-500">
                {dashboardData.description}
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
            layout={gridLayout}
            rowHeight={80}
            cols={12}
            width={containerBounds.width}
            onDragStop={setGridLayout}
            onResizeStop={setGridLayout}
          >
            {chartIds.map((chartId) => (
              <div key={chartId}>
                <Chart chartId={chartId} />
              </div>
            ))}
          </GridLayout>
        </div>
      )
    }
  }, [
    dashboardData,
    measureContainer,
    containerBounds.width,
    gridLayout,
    setGridLayout,
    chartIds,
  ])

  return <>{dashboardContent}</>
}
