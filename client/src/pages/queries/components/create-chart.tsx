import React, {
  cloneElement,
  useMemo,
  useContext,
  useState,
  useCallback,
} from 'react'
import { Form, Empty, Select, Input, Button, Tooltip, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import EditorContext from 'contexts/editor-context'
import { ChartType } from 'types/chart'
import { FormFieldData } from 'types/form-fields'
import { chartGroups, chartList, chartOrder } from '../data/chart-list'
import { createChart, fetchChartsForQuery } from '../chart-queries'

type CreateChartProps = {
  changeActiveChartId: (id: string) => void
}

export default function CreateChart({ changeActiveChartId }: CreateChartProps) {
  const { queryResult, isSaved, queryId } = useContext(EditorContext)

  const [fields, setFields] = useState<FormFieldData[]>([
    { name: ['type'], value: ChartType.LINE },
    { name: ['name'], value: 'Untitled Chart' },
    { name: ['label'] },
    { name: ['values'] },
  ])

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
      changeActiveChartId(createdChart.id.toString())
    },
  })
  const label =
    fields[fields.findIndex((field) => field.name[0] === 'label')].value
  const values =
    fields[fields.findIndex((field) => field.name[0] === 'values')].value
  const name =
    fields[fields.findIndex((field) => field.name[0] === 'name')].value
  const type =
    fields[fields.findIndex((field) => field.name[0] === 'type')].value

  const chartData = useMemo(() => {
    if (label && values && queryResult) {
      return (values as string[])
        .map((value) =>
          queryResult.rows.map((row) => {
            return { label: row[label], value: row[value], type: value }
          }),
        )
        .flat()
    }
    return []
  }, [queryResult, label, values])

  function handleCreateChart(values: any) {
    addChart({ ...values, query: parseInt(queryId) })
  }

  const onChange = useCallback((newFields) => {
    setFields(newFields)
  }, [])

  return (
    <div className="flex w-full h-full" style={{ width: 'calc(100% - 16rem)' }}>
      <div
        className="flex flex-col px-4 pb-8 space-y-4"
        style={{ width: 'calc(100% - 16rem)' }}
      >
        {label && values ? (
          <>
            <div className="font-semibold">{name}</div>
            {cloneElement(chartList[type as ChartType].chart, {
              data: chartData,
            })}
          </>
        ) : (
          <Empty description={<span>Select data to plot chart</span>} />
        )}
      </div>
      <Form
        layout="vertical"
        className="flex-shrink-0 w-64 h-full pl-4 border-l"
        fields={fields}
        onFieldsChange={(_, allFields) => {
          onChange(allFields)
        }}
        onFinish={handleCreateChart}
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
          <Select placeholder="Add values" mode="multiple" className="w-full">
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
