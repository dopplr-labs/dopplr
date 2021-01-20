import React, {
  useMemo,
  cloneElement,
  useContext,
  useState,
  useCallback,
} from 'react'
import { Result, Form, Select, Input, Button, Modal, message } from 'antd'
import { range } from 'lodash-es'
import { queryCache, useMutation, useQuery } from 'react-query'
import EditorContext from 'contexts/editor-context'
import { Chart, ChartTypes } from 'types/chart'
import {
  deleteChart,
  fetchChart,
  fetchChartsForQuery,
  updateChart,
} from '../chart-queries'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'

type ChartDetailProps = {
  chartId: number
  changeActiveChartId: (id: number) => void
}

export default function ChartDetail({
  chartId,
  changeActiveChartId,
}: ChartDetailProps) {
  const { queryResult, queryId } = useContext(EditorContext)
  const [form] = Form.useForm()

  const [chartType, setChartType] = useState<ChartTypes>('line')
  const [label, setLabel] = useState<string | undefined>()
  const [values, setValues] = useState<string[] | undefined>()
  const [title, setTitle] = useState<string>('Untitled Chart')

  const { data: chart, isLoading, error } = useQuery(
    ['chart', chartId],
    () => fetchChart(chartId),
    {
      onSettled: (chart) => {
        if (chart) {
          setTitle(chart.name)
          setValues(chart.values)
          setLabel(chart.label)
          setChartType(chart.type)
          form.setFieldsValue({
            type: chart.type,
            name: chart.name,
            label: chart.label,
            values: chart.values,
          })
        }
      },
    },
  )
  const [disabled, setDisbaled] = useState<boolean>(true)

  const { data: charts } = useQuery(['charts', queryId], () =>
    fetchChartsForQuery(parseInt(queryId)),
  )

  const [editChart, { isLoading: isUpdatingChart }] = useMutation(updateChart, {
    onMutate: (updatedChart) => {
      queryCache.setQueryData(
        ['charts', queryId],
        charts?.map((chart) =>
          chart.id === updatedChart.id ? { ...chart, ...updatedChart } : chart,
        ),
      )
      queryCache.setQueryData(['chart', chartId], { ...chart, ...updatedChart })
    },
    onSuccess: () => {
      message.success('Chart updated successfully')
    },
  })

  const [removeChart, { isLoading: isRemovingChart }] = useMutation(
    deleteChart,
    {
      onMutate: (deletedChart) => {
        queryCache.setQueryData(
          ['charts', queryId],
          charts?.filter((chart) => chart.id !== deletedChart.id),
        )
        queryCache.removeQueries(['chart', chartId])
        const updatedCharts: Chart[] | undefined = queryCache.getQueryData([
          'charts',
          queryId,
        ])
        changeActiveChartId(updatedCharts?.length ? updatedCharts[0].id : -1)
      },
    },
  )

  const onFinish = useCallback(
    (values: any) => {
      editChart({
        id: chartId,
        ...values,
      })
    },
    [editChart, chartId],
  )

  const confirmDelete = useCallback(() => {
    Modal.confirm({
      title: 'Delete this chart?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        removeChart({ id: chartId })
      },
    })
  }, [removeChart, chartId])

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
    if (isLoading || !chartData) {
      return (
        <div className="flex flex-1 w-full h-full">
          <div className="flex flex-col w-full px-4 pb-8 space-y-4">
            <div className="w-48 h-8 bg-background-secondary animate-pulse" />
            <div className="w-full h-full bg-background-secondary animate-pulse" />
          </div>
          <div className="flex-shrink-0 w-64 h-full pt-10 pl-4 space-y-8 border-l">
            {range(5).map((val) => (
              <div
                key={val}
                className="w-full h-8 bg-background-secondary animate-pulse"
                style={{ opacity: 1 - val / 5 }}
              />
            ))}
          </div>
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (chart) {
      return (
        <div
          className="flex w-full h-full"
          style={{ width: 'calc(100% - 16rem)' }}
        >
          <div
            className="flex flex-col px-4 pb-8 space-y-4"
            style={{ width: 'calc(100% - 16rem)' }}
          >
            <div className="font-semibold">{title}</div>
            {cloneElement(chartList[chartType].chart, { data: chartData })}
          </div>
          <Form
            layout="vertical"
            className="flex-shrink-0 w-64 h-full pl-4 border-l"
            form={form}
            onValuesChange={() => setDisbaled(false)}
            onFinish={onFinish}
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
              <Button
                htmlType="button"
                danger
                loading={isRemovingChart}
                onClick={confirmDelete}
              >
                Delete
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                disabled={disabled}
                loading={isUpdatingChart}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      )
    }
  }, [
    isLoading,
    isRemovingChart,
    isUpdatingChart,
    error,
    chart,
    form,
    onFinish,
    chartData,
    chartType,
    label,
    queryResult,
    title,
    values,
    disabled,
    confirmDelete,
  ])

  return <>{chartContent}</>
}
