import { Bar, Line, Pie } from '@ant-design/plots'
import { QueryChartConfig, QueryChartConfigInput, QueryChartType } from '@/types/query-chart'

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
