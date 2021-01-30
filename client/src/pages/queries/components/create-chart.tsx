import React, { cloneElement, useMemo, useContext, useState } from 'react'
import { Form, Empty, Select, Input, Button, Tooltip, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import EditorContext from 'contexts/editor-context'
import { ChartTypes } from 'types/chart'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'
import { createChart, fetchChartsForQuery } from '../chart-queries'

type CreateChartProps = {
  changeActiveChartId: (id: number) => void
}

export default function CreateChart({ changeActiveChartId }: CreateChartProps) {
  const { queryResult, isSaved, queryId } = useContext(EditorContext)

  const [label, setLabel] = useState<string | undefined>()
  const [values, setValues] = useState<string[] | undefined>()
  const [title, setTitle] = useState<string>('Untitled Chart')
  const [chartType, setChartType] = useState<ChartTypes>('line')

  const { data: charts } = useQuery(
    ['charts', queryId],
    () => fetchChartsForQuery(parseInt(queryId)),
    { enabled: isSaved },
  )

  const queryClient = useQueryClient()

  const { mutate: addChart, isLoading } = useMutation(createChart, {
    onSuccess: (createdChart) => {
      queryClient.setQueryData(
        ['charts', queryId],
        charts ? [createdChart, ...charts] : [createdChart],
      )
      message.success('Chart created successfully')
      changeActiveChartId(createdChart.id)
    },
  })

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
    return []
  }, [label, values, queryResult])

  function handleCreateChart(values: any) {
    addChart({ ...values, query: parseInt(queryId) })
  }

  return (
    <div className="flex w-full h-full" style={{ width: 'calc(100% - 16rem)' }}>
      <div
        className="flex flex-col px-4 pb-8 space-y-4"
        style={{ width: 'calc(100% - 16rem)' }}
      >
        {label && values ? (
          <>
            <div className="font-semibold">{title}</div>
            {cloneElement(chartList[chartType].chart, { data: chartData })}
          </>
        ) : (
          <Empty description={<span>Select data to plot chart</span>} />
        )}
      </div>
      <Form
        layout="vertical"
        className="flex-shrink-0 w-64 h-full pl-4 border-l"
        initialValues={{ type: chartType, name: title, label, values }}
        onFinish={handleCreateChart}
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
        {isSaved ? (
          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Create Chart
          </Button>
        ) : (
          <Tooltip title="Save query to create Chart" className="w-full">
            <Button style={{ width: 'inherit' }} disabled={!isSaved}>
              Create Chart
            </Button>
          </Tooltip>
        )}
      </Form>
    </div>
  )
}
