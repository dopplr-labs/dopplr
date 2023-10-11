import { Bar, Line, Pie } from '@ant-design/plots'
import dayjs from 'dayjs'
import { QueryChartConfig, QueryChartConfigInput, QueryChartType } from '@/types/query-chart'
import { QueryResult } from '@/types/tab'

export const QUERY_CHARTS = [
  {
    id: 'bar-chart',
    label: 'Bar Chart',
  },
  {
    id: 'pie-chart',
    label: 'Pie Chart',
  },
  {
    id: 'line-chart',
    label: 'Line Chart',
  },
] as const

export const QUERY_CHARTS_CONFIG: Record<QueryChartType, QueryChartConfig> = {
  'bar-chart': {
    type: 'bar-chart',
    Component: Bar,
    inputs: [
      {
        key: 'xField',
        label: 'X Field',
        type: 'col-select',
        required: true,
      },
      {
        key: 'yField',
        label: 'Y Field',
        type: 'col-select',
        required: true,
      },
      {
        key: 'seriesField',
        label: 'Series Field',
        type: 'col-select',
      },
      {
        key: 'legend',
        label: 'Show Legend',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  'pie-chart': {
    type: 'pie-chart',
    Component: Pie,
    inputs: [
      {
        key: 'angleField',
        label: 'Angle Field',
        type: 'col-select',
        required: true,
      },
      {
        key: 'colorField',
        label: 'Color Field',
        type: 'col-select',
        required: true,
      },
    ],
  },
  'line-chart': {
    type: 'line-chart',
    Component: Line,
    inputs: [
      {
        key: 'xField',
        label: 'X Field',
        type: 'col-select',
        required: true,
      },
      {
        key: 'yField',
        label: 'Y Field',
        type: 'col-select',
        required: true,
      },
    ],
  },
}

export function getConfigFromValues(
  chartType: QueryChartType,
  values: Record<string, string | number | boolean>,
): Record<string, any> {
  switch (chartType) {
    case 'bar-chart': {
      return values
    }

    case 'pie-chart': {
      return values
    }

    case 'line-chart': {
      return values
    }

    default: {
      return values
    }
  }
}

/** @TODO Create zod validation dynamically and get isValid from there */
export function isFormValid(
  inputs: QueryChartConfigInput[],
  values: Record<string, string | number | boolean>,
): boolean {
  let isValid = true
  const requiredInputs = inputs.filter((input) => input.required)

  requiredInputs.forEach((input) => {
    if (!values[input.key]) {
      isValid = false
    }
  })

  return isValid
}

export function parseQueryResult(queryResult: QueryResult) {
  return queryResult.map((result) => {
    return Object.entries(result).reduce(
      (acc, [key, value]) => {
        if (value instanceof Date) {
          acc = {
            ...acc,
            [key]: dayjs(value as Date).format('DD-MM-YYYY'),
          }
        } else if (!Number.isNaN(Number(value))) {
          acc = {
            ...acc,
            [key]: Number(value),
          }
        } else {
          acc[key] = value as string
        }

        return acc
      },
      {} as Record<string, string | number>,
    )
  })
}
