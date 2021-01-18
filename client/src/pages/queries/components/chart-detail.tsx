import React, { useMemo, cloneElement, useContext, useState } from 'react'
import { Result, Form, Select, Input, Button } from 'antd'
import { useQuery } from 'react-query'
import EditorContext from 'contexts/editor-context'
import { ChartTypes } from 'types/chart'
import { fetchChart } from '../chart-queries'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'

type ChartDetailProps = {
  chartId: number
}

export default function ChartDetail({ chartId }: ChartDetailProps) {
  const { queryResult } = useContext(EditorContext)

  const [chartType, setChartType] = useState<ChartTypes>('line')
  const [label, setLabel] = useState<string | undefined>()
  const [values, setValues] = useState<string[] | undefined>()
  const [title, setTitle] = useState<string>('Untitled Chart')

  const { data: chart, isLoading, error } = useQuery(
    ['chart', chartId],
    () => fetchChart(chartId),
    {
      onSuccess: (chart) => {
        setTitle(chart.name)
        setValues(chart.values)
        setLabel(chart.label)
        setChartType(chart.type)
      },
    },
  )

  const chartData = useMemo(() => {
    if (label && values && queryResult) {
      return values
        .map((value) =>
          queryResult.rows.map((row) => {
            return { label: row[label], value: row[value], type: value }
          }),
        )
        .flat()
    }
  }, [queryResult, label, values])

  const chartContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full h-full bg-background-secondary animate-pulse" />
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (chart) {
      return (
        <div className="flex flex-1 w-full h-full ">
          <div className="flex flex-col w-full px-4 pb-8 space-y-4">
            <div className="font-semibold">{chart.name}</div>
            {cloneElement(chartList[chart.type].chart, { data: chartData })}
          </div>
          <Form
            layout="vertical"
            className="flex-shrink-0 w-64 h-full pl-4 border-l"
            initialValues={{ type: chartType, name: title, label, values }}
          >
            <Form.Item label="Chart Type" name="type">
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
            <Form.Item label="Label" name="label">
              <Select
                placeholder="Add label"
                className="w-full"
                value={label}
                onChange={setLabel}
              >
                {queryResult?.fields.map((field) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Values" name="values">
              <Select
                placeholder="Add values"
                mode="multiple"
                className="w-full"
                value={values}
                onChange={setValues}
              >
                {queryResult?.fields.map((field) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Chart Title" name="name">
              <Input
                placeholder="Enter chart title"
                value={title}
                onChange={({ target: { value } }) => {
                  setTitle(value)
                }}
              />
            </Form.Item>
            <div className="flex items-center justify-between">
              <Button htmlType="button" danger>
                Delete
              </Button>
              <Button htmlType="submit" type="primary">
                Save
              </Button>
            </div>
          </Form>
        </div>
      )
    }
  }, [
    isLoading,
    error,
    chart,
    chartData,
    chartType,
    label,
    queryResult?.fields,
    title,
    values,
  ])

  return <>{chartContent}</>
}
