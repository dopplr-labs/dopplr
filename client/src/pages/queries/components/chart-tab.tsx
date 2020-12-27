import React, { useMemo, useState } from 'react'
import { Select, Form, Input, Empty } from 'antd'
import { Line, Area, Column, Scatter } from '@ant-design/charts'
import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { QueryResult } from 'types/query'

type ChartTabProps = {
  data: QueryResult | null
}

export default function ChartTab({ data }: ChartTabProps) {
  const [xAxis, setXAxis] = useState<string | undefined>()
  const [yAxis, setYAxis] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>('Untitled Chart')
  const [chartType, setChartType] = useState<string>('line')

  const chartData = useMemo(() => {
    if (xAxis && yAxis) {
      return data?.rows.map((row) => {
        const result: any = {}
        result[xAxis] = row[xAxis]
        result[yAxis] = row[yAxis]
        return result
      })
    } else {
      return []
    }
  }, [data, xAxis, yAxis])

  const config = useMemo(() => {
    return {
      data: chartData ?? [],
      xField: xAxis ?? '',
      yField: yAxis ?? '',
      autoFit: true,
    }
  }, [xAxis, yAxis, chartData])

  const chartList = useMemo(
    () => [
      {
        id: 'line',
        icon: <LineChartOutlined />,
        label: 'Line Chart',
        chart: <Line {...config} />,
      },
      {
        id: 'area',
        icon: <AreaChartOutlined />,
        label: 'Area Chart',
        chart: <Area {...config} />,
      },
      {
        id: 'column',
        icon: <BarChartOutlined />,
        label: 'Column Chart',
        chart: <Column {...config} />,
      },
      {
        id: 'scatter',
        icon: <DotChartOutlined />,
        label: 'Scatter Plot',
        chart: <Scatter {...config} />,
      },
    ],
    [config],
  )

  const chartContent = useMemo(() => {
    if (!data) {
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
            <div className="text-gray-500 ">Run query to plot charts</div>
          </div>
        </>
      )
    }

    if (data) {
      return (
        <div className="flex w-full h-full">
          <div className="flex flex-col flex-1 px-8 pb-8 space-y-4">
            {xAxis && yAxis ? (
              <>
                <div className="text-center">{title}</div>
                {
                  chartList[
                    chartList.findIndex((chart) => chart.id === chartType)
                  ].chart
                }
              </>
            ) : (
              <Empty description={<span>Select data to plot chart</span>} />
            )}
          </div>
          <div className="flex-shrink-0 w-1/4 h-full py-4 pl-4 border-l">
            <Form layout="vertical">
              <Form.Item label="Chart Type">
                <Select
                  value={chartType}
                  onChange={(value) => {
                    setChartType(value)
                  }}
                >
                  {chartList.map((chart) => (
                    <Select.Option key={chart.id} value={chart.id}>
                      <div className="flex items-center space-x-3">
                        {chart.icon}
                        <span>{chart.label}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="X Axis">
                <Select
                  placeholder="Add X-Axis"
                  className="w-full"
                  value={xAxis}
                  onChange={(value) => {
                    setXAxis(value)
                  }}
                >
                  {data.fields.map((field) => (
                    <Select.Option key={field.columnId} value={field.name}>
                      {field.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Y Axis">
                <Select
                  placeholder="Add Y-Axis"
                  className="w-full"
                  value={yAxis}
                  onChange={(value) => {
                    setYAxis(value)
                  }}
                >
                  {data.fields.map((field) => (
                    <Select.Option key={field.columnId} value={field.name}>
                      {field.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Chart Title">
                <Input
                  placeholder="Enter chart title"
                  value={title}
                  onChange={({ target: { value } }) => {
                    setTitle(value)
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      )
    }
  }, [data, xAxis, yAxis, title, chartList, chartType])

  return <>{chartContent}</>
}
