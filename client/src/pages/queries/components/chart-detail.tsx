import React, {
  useMemo,
  cloneElement,
  useContext,
  useState,
  useCallback,
} from 'react'
import { Result, Form, Select, Input, Button, Modal, message } from 'antd'
import { range } from 'lodash-es'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import EditorContext from 'contexts/editor-context'
import { Chart, ChartType } from 'types/chart'
import { FormFieldData } from 'types/form-fields'
import { createDashboardChart, fetchDashboards } from 'pages/dashboards/queries'
import {
  deleteChart,
  fetchChart,
  fetchChartsForQuery,
  updateChart,
} from '../chart-queries'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'

export default function ChartDetail() {
  const { queryResult, queryId } = useContext(EditorContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChartId = searchParams.get('chart')

  const [form] = Form.useForm()

  const [fields, setFields] = useState<FormFieldData[]>([
    { name: ['type'] },
    { name: ['name'] },
    { name: ['label'] },
    { name: ['values'] },
  ])
  const formValues = useMemo(() => {
    const formValues: Record<string, any> = {}
    fields.forEach(({ name, value }) => {
      formValues[name[0]] = value
    })
    return formValues
  }, [fields])

  const handleOpenChartDetail = useCallback(
    (id: string) => {
      setSearchParams({ tab: 'chart', chart: id })
    },
    [setSearchParams],
  )

  const { data: chart, isLoading, error } = useQuery(
    ['chart', activeChartId],
    () => fetchChart(parseInt(activeChartId ?? '')),
    {
      onSettled: (chart) => {
        if (chart) {
          setFields([
            { name: ['type'], value: chart.type },
            { name: ['name'], value: chart.name },
            { name: ['label'], value: chart.label },
            { name: ['values'], value: chart.values },
          ])
        }
      },
    },
  )

  const { data: charts } = useQuery(['charts', queryId], () =>
    fetchChartsForQuery(parseInt(queryId)),
  )

  const { data: dashboards } = useQuery(['dashboards'], fetchDashboards)

  const queryClient = useQueryClient()

  const { mutate: editChart, isLoading: isUpdatingChart } = useMutation(
    updateChart,
    {
      onSuccess: (updatedChart) => {
        queryClient.setQueryData(
          ['charts', queryId],
          charts?.map((chart) =>
            chart.id === updatedChart.id
              ? { ...chart, ...updatedChart }
              : chart,
          ),
        )
        queryClient.setQueryData(['chart', activeChartId], {
          ...chart,
          ...updatedChart,
        })
        message.success('Chart updated successfully')
      },
    },
  )

  const { mutate: removeChart, isLoading: isRemovingChart } = useMutation(
    deleteChart,
    {
      onSuccess: (deletedChart) => {
        queryClient.setQueryData(
          ['charts', queryId],
          charts?.filter((chart) => chart.id !== deletedChart.id),
        )
        queryClient.removeQueries(['chart', activeChartId])
        const updatedCharts: Chart[] | undefined = queryClient.getQueryData([
          'charts',
          queryId,
        ])
        handleOpenChartDetail(updatedCharts?.[0].id.toString() ?? 'new')
      },
    },
  )

  const { mutate: addDashboardChart } = useMutation(createDashboardChart)

  const onChange = useCallback((newFields) => {
    setFields(newFields)
  }, [])

  const onFinish = useCallback(
    (values: any) => {
      editChart({ id: activeChartId, ...values })
    },
    [activeChartId, editChart],
  )

  const confirmDelete = useCallback(() => {
    Modal.confirm({
      title: 'Delete this chart?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        removeChart({ id: parseInt(activeChartId ?? '') })
      },
    })
  }, [removeChart, activeChartId])

  const chartData = useMemo(() => {
    const { label, values } = formValues
    if (label && values && queryResult) {
      return (values as string[])
        .map((value) =>
          queryResult.rows.map((row) => {
            return { label: row[label], value: row[value], type: value }
          }),
        )
        .flat()
    }
    return undefined
  }, [queryResult, formValues])

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
      const { name, type } = formValues
      return (
        <div
          className="flex w-full h-full"
          style={{ width: 'calc(100% - 16rem)' }}
        >
          <div
            className="flex flex-col px-4 pb-8 space-y-4"
            style={{ width: 'calc(100% - 16rem)' }}
          >
            <div className="flex items-start justify-between">
              <div className="font-semibold">{name}</div>
              <Select
                placeholder="Publish to dashboard"
                className="w-48"
                onChange={(dashboard: number) => {
                  addDashboardChart({
                    dashboard,
                    chart: parseInt(activeChartId ?? ''),
                  })
                }}
              >
                {dashboards?.map((dashboard) => (
                  <Select.Option key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {cloneElement(chartList[type as ChartType].chart, {
              data: chartData,
            })}
          </div>
          <Form
            layout="vertical"
            className="flex-shrink-0 w-64 h-full pl-4 border-l"
            form={form}
            fields={fields}
            onFieldsChange={(_, allFields) => {
              onChange(allFields)
            }}
            onFinish={onFinish}
          >
            <Form.Item label="Chart Type" name="type">
              <Select showSearch>
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
              <Select placeholder="Add label" className="w-full">
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
              >
                {queryResult?.fields.map((field) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Chart Title" name="name">
              <Input placeholder="Enter chart title" />
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
                disabled={!form.isFieldsTouched()}
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
    chartData,
    error,
    chart,
    formValues,
    fields,
    onChange,
    onFinish,
    form,
    queryResult,
    confirmDelete,
    isRemovingChart,
    isUpdatingChart,
    dashboards,
    activeChartId,
    addDashboardChart,
  ])

  return <>{chartContent}</>
}
