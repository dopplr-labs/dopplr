import React from 'react'
import {
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons'

export default function ChartTab() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <LineChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Line Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <AreaChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Area Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <PieChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Pie Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <BarChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Bar Chart</div>
          </div>
        </div>
        <div className="text-gray-500 ">Currently under development</div>
      </div>
    </>
  )
}
