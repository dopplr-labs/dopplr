import React, { cloneElement, useMemo, useState } from 'react'
import { Empty, Form, Select, Input } from 'antd'
import {
  LineChartOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { QueryResult } from 'types/query'
import { ChartTypes } from 'types/chart'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'

type ChartTabProps = {
  data: QueryResult | null
}

export default function ChartTab({ data }: ChartTabProps) {
  const [label, setLabel] = useState<string | undefined>()
  const [values, setValues] = useState<string | string[] | undefined>()
  const [title, setTitle] = useState<string | undefined>('Untitled Chart')
  const [chartType, setChartType] = useState<ChartTypes>('line')

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
                {cloneElement(chartList[chartType].chart, { data: chartData })}
              </>
            ) : (
              <Empty description={<span>Select data to plot chart</span>} />
            )}
          </div>
          <Form layout="vertical" className="w-96 h-full py=4 pl-4 border-l">
            <Form.Item label="Chart Type">
              <Select showSearch value={chartType} onChange={setChartType}>
                {chartGroups.map((group) => (
                  <Select.OptGroup label={group} key={group}>
                    {chartOrder
                      .filter((chart) => chartList[chart].group === group)
                      .map((chart) => (
                        <Select.Option key={chart} value={chart}>
                          <div className="flex items-center space-x-3">
                            {chartList[chart].icon}
                            <span>{chartList[chart].label}</span>
                          </div>
                        </Select.Option>
                      ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Label">
              <Select
                placeholder="Add label"
                className="w-full"
                value={label}
                onChange={setLabel}
              >
                {data.fields.map((field) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Values">
              <Select
                placeholder="Add values"
                mode="multiple"
                className="w-full"
                value={values}
                onChange={setValues}
              >
                {data.fields.map((field) => (
                  <Select.Option key={field.name} value={field.name}>
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
  }, [data, label, values, chartData, chartType, title])

  return <>{chartContent}</>
}
