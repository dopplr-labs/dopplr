import React, { useMemo, useState } from 'react'
import { Empty, Form, Select, Input } from 'antd'
import { Line, Area, Column, Scatter, Bar, Pie } from '@ant-design/charts'
import {
  LineChartOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
} from '@ant-design/icons'
import { QueryResult } from 'types/query'

type ChartTabProps = {
  data: QueryResult | null
}

export default function ChartTab({ data }: ChartTabProps) {
  const [label, setLabel] = useState<string | undefined>()
  const [values, setValues] = useState<string | string[] | undefined>()
  const [title, setTitle] = useState<string | undefined>('Untitled Chart')
  const [chartType, setChartType] = useState<string>('line')

  const chartData = useMemo(() => {
    if (label && values && data) {
      if (typeof values === 'string') {
        return data.rows.map((row) => {
          return { label: row[label], value: row[values], type: values }
        })
      } else {
        return values
          .map((value) =>
            data.rows.map((row) => {
              return { label: row[label], value: row[value], type: value }
            }),
          )
          .flat()
      }
    } else {
      return []
    }
  }, [label, values, data])

  const config = useMemo(() => {
    return {
      data: chartData,
      xField: 'label',
      yField: 'value',
      seriesField: 'type',
      autoFit: true,
    }
  }, [chartData])

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
        chart: <Column {...config} isGroup />,
      },
      {
        id: 'bar',
        icon: <BarChartOutlined className="transform rotate-90" />,
        label: 'Bar Chart',
        chart: <Bar {...config} xField="value" yField="label" isGroup />,
      },
      {
        id: 'pie',
        icon: <PieChartOutlined />,
        label: 'Pie Chart',
        chart: <Pie data={chartData} angleField="value" colorField="label" />,
      },
      {
        id: 'scatter',
        icon: <DotChartOutlined />,
        label: 'Scatter Plot',
        chart: <Scatter {...config} />,
      },
    ],
    [config, chartData],
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
          <div className="flex flex-col w-full px-8 pb-8 space-y-4">
            {label && values ? (
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
          <Form layout="vertical" className="w-80 h-full py=4 pl-4 border-l">
            <Form.Item label="Chart Type">
              <Select
                showSearch
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
            <Form.Item label="Label">
              <Select
                placeholder="Add label"
                className="w-full"
                value={label}
                onChange={(value) => {
                  setLabel(value)
                }}
              >
                {data.fields.map((field) => (
                  <Select.Option key={field.columnId} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Values">
              <Select
                placeholder="Add values"
                mode={chartType !== 'pie' ? 'multiple' : undefined}
                className="w-full"
                value={values}
                onChange={(value) => {
                  setValues(value)
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
      )
    }
  }, [data, label, values, chartList, chartType, title])

  return <>{chartContent}</>
}
