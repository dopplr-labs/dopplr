import { Bar, Column, Line, Pie } from '@ant-design/plots'
import dayjs from 'dayjs'
import z from 'zod'
import { QueryChartConfig, QueryChartType } from '@/types/query-chart'
import { QueryResult } from '@/types/tab'

export const QUERY_CHARTS = [
  {
    id: 'bar-chart',
    label: 'Bar Chart',
  },
  {
    id: 'column-chart',
    label: 'Column Chart',
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

const LEGEND_POSITIONS = [
  'top',
  'top-left',
  'top-right',
  'right',
  'right-top',
  'right-bottom',
  'left',
  'left-top',
  'left-bottom',
  'bottom',
  'bottom-left',
  'bottom-right',
]

const PIE_LABEL_TYPES = ['inner', 'outer', 'spider']

export const QUERY_CHARTS_CONFIG: Record<QueryChartType, QueryChartConfig> = {
  'bar-chart': {
    type: 'bar-chart',
    Component: Bar,
    inputs: [
      {
        key: 'xField',
        label: 'X Field',
        type: 'col-select',
      },
      {
        key: 'yField',
        label: 'Y Field',
        type: 'col-select',
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
        description: 'To show a legend make sure you have selected series field!',
      },
      {
        key: 'legendPosition',
        label: 'Legend Position',
        type: 'select',
        options: LEGEND_POSITIONS.map((position) => ({ id: position, label: position.replace('-', ' ') })),
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      seriesField: z.string().optional(),
      legend: z.boolean().default(true).optional(),
      legendPosition: z.string().optional(),
    }),
  },
  'column-chart': {
    type: 'column-chart',
    Component: Column,
    inputs: [
      {
        key: 'xField',
        label: 'X Field',
        type: 'col-select',
      },
      {
        key: 'yField',
        label: 'Y Field',
        type: 'col-select',
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
        description: 'To show a legend make sure you have selected series field!',
      },
      {
        key: 'legendPosition',
        label: 'Legend Position',
        type: 'select',
        options: LEGEND_POSITIONS.map((position) => ({ id: position, label: position.replace('-', ' ') })),
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      seriesField: z.string().optional(),
      legend: z.boolean().default(true).optional(),
      legendPosition: z.string().optional(),
    }),
  },
  'pie-chart': {
    type: 'pie-chart',
    Component: Pie,
    inputs: [
      {
        key: 'angleField',
        label: 'Angle Field',
        type: 'col-select',
      },
      {
        key: 'colorField',
        label: 'Color Field',
        type: 'col-select',
      },
      {
        key: 'labelType',
        label: 'Label Type',
        type: 'select',
        options: PIE_LABEL_TYPES.map((labelType) => ({ id: labelType, label: labelType })),
        defaultValue: 'outer',
      },
      {
        key: 'radius',
        label: 'Radius',
        type: 'slider',
        min: 0.1,
        max: 1,
        step: 0.1,
        defaultValue: 0.9,
      },
    ],
    validationSchema: z.object({
      angleField: z.string(),
      colorField: z.string(),
      radius: z.coerce.number().min(0.1).max(1).default(0.9),
      labelType: z.string().default('outer').optional(),
    }),
  },
  'line-chart': {
    type: 'line-chart',
    Component: Line,
    inputs: [
      {
        key: 'xField',
        label: 'X Field',
        type: 'col-select',
      },
      {
        key: 'yField',
        label: 'Y Field',
        type: 'col-select',
      },
      {
        key: 'smooth',
        label: 'Smooth',
        type: 'boolean',
        defaultValue: false,
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      smooth: z.boolean().default(false),
    }),
  },
}

export function getConfigFromValues(
  chartType: QueryChartType,
  values: Record<string, string | number | boolean>,
): Record<string, any> {
  switch (chartType) {
    case 'bar-chart': {
      return {
        ...values,
        legend: values.legend
          ? {
              position: values.legendPosition,
            }
          : values.legend,
      }
    }

    case 'column-chart': {
      return {
        ...values,
        legend: values.legend
          ? {
              position: values.legendPosition,
            }
          : values.legend,
      }
    }

    case 'pie-chart': {
      return { ...values, label: { type: values.labelType } }
    }

    case 'line-chart': {
      return values
    }

    default: {
      return values
    }
  }
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
