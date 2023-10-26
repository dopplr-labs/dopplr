import { Area, Bar, Column, Line, Pie } from '@ant-design/plots'
import dayjs from 'dayjs'
import z from 'zod'
import { P, match } from 'ts-pattern'
import { QueryChartConfig, QueryChartType } from '@/types/query-chart'
import { QueryResult } from '@/types/tab'

export const QUERY_CHARTS = [
  {
    id: 'BAR_CHART',
    label: 'Bar Chart',
  },
  {
    id: 'COLUMN_CHART',
    label: 'Column Chart',
  },
  {
    id: 'PIE_CHART',
    label: 'Pie Chart',
  },
  {
    id: 'LINE_CHART',
    label: 'Line Chart',
  },
  {
    id: 'AREA_CHART',
    label: 'Area Chart',
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
  BAR_CHART: {
    type: 'BAR_CHART',
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
  COLUMN_CHART: {
    type: 'COLUMN_CHART',
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
  PIE_CHART: {
    type: 'PIE_CHART',
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
      {
        key: 'innerRadius',
        label: 'Inner Radius',
        type: 'slider',
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 0,
      },
    ],
    validationSchema: z.object({
      angleField: z.string(),
      colorField: z.string(),
      labelType: z.string().default('outer').optional(),
      radius: z.coerce.number().min(0.1).max(1).default(0.9),
      innerRadius: z.coerce.number().min(0).max(1).default(0),
    }),
  },
  LINE_CHART: {
    type: 'LINE_CHART',
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
        key: 'seriesField',
        label: 'Series Field',
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
      seriesField: z.string().optional(),
      smooth: z.boolean().default(false),
    }),
  },
  AREA_CHART: {
    type: 'AREA_CHART',
    Component: Area,
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
        key: 'isPercent',
        label: 'Is Percent?',
        type: 'boolean',
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      seriesField: z.string().optional(),
      smooth: z.boolean().default(false),
      isPercent: z.boolean().default(false),
    }),
  },
}

export function getConfigFromValues(
  chartType: QueryChartType,
  values: Record<string, string | number | boolean>,
): Record<string, any> {
  switch (chartType) {
    case 'BAR_CHART': {
      return {
        ...values,
        legend: values.legend
          ? {
              position: values.legendPosition,
            }
          : values.legend,
      }
    }

    case 'COLUMN_CHART': {
      return {
        ...values,
        legend: values.legend
          ? {
              position: values.legendPosition,
            }
          : values.legend,
      }
    }

    case 'PIE_CHART': {
      return { ...values, label: { type: values.labelType } }
    }

    case 'LINE_CHART': {
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
        return match(value)
          .with(P.instanceOf(Date), (_value) => ({
            ...acc,
            [key]: dayjs(_value).format('DD-MM-YYYY'),
          }))
          .with(P.array(P.instanceOf(Date)), (_value) => ({
            ...acc,
            [key]: _value.map((date) => dayjs(date).format('DD-MM-YYYY')),
          }))
          .with(
            P.when((_value) => !Number.isNaN(Number(_value))),
            (_value) => ({
              ...acc,
              [key]: Number(_value),
            }),
          )
          .with(P.instanceOf(Object), (_value) => ({ ...acc, [key]: JSON.stringify(_value) }))
          .otherwise((_value) => ({
            ...acc,
            [key]: _value as string,
          }))
      },
      {} as Record<string, string | number | string[]>,
    )
  })
}
