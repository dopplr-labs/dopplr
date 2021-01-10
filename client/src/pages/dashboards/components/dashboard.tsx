import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import GridLayout from 'react-grid-layout'
import useMeasure from 'react-use-measure'
import { Result } from 'antd'
import { SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
import { range } from 'lodash-es'
import { dashboardList } from '../data/dashboard-data'

export default function Dashboard() {
  const { dashboardId } = useParams()
  const [measureContainer, containerBounds] = useMeasure()

  const dashboardData =
    dashboardList[
      dashboardList.findIndex((dashboard) => dashboard.id === dashboardId)
    ]

  const layout = useMemo(
    () =>
      range(10).map((item) => {
        const y = Math.ceil(Math.random() * 4) + 1
        return {
          x: (item * 3) % 12,
          y: Math.floor(item / 4) * y,
          w: 3,
          h: y,
          i: item.toString(),
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dashboardId],
  )

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
            layout={layout}
            rowHeight={80}
            cols={12}
            width={containerBounds.width}
          >
            {range(10).map((item) => (
              <div
                key={item.toString()}
                className="flex items-center justify-center bg-gray-200 "
              >
                {item}
              </div>
            ))}
          </GridLayout>
        </div>
      )
    }
  }, [dashboardData, measureContainer, containerBounds.width, layout])

  return <>{dashboardContent}</>
}
