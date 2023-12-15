import { Area, Bar, Column, Gauge, Heatmap, Line, Pie, Scatter } from '@ant-design/plots'
import dayjs from 'dayjs'
import z from 'zod'
import { P, match } from 'ts-pattern'
import { QueryChartConfig, QueryChartType } from '@/types/query-chart'
import { QueryResult } from '@/types/tab'
import StatsCard from '@/app/(authenticated-app)/charts/_components/stats-card'

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
  {
    id: 'GAUGE_CHART',
    label: 'Gauge Chart',
  },
  {
    id: 'SCATTER_CHART',
    label: 'Scatter Chart',
  },
  {
    id: 'HEAT_MAP',
    label: 'Heat Map',
  },
  {
    id: 'STAT_CARD',
    label: 'Stats Card',
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

const SHAPES = ['circle', 'square']

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
  GAUGE_CHART: {
    type: 'GAUGE_CHART',
    Component: Gauge,
    inputs: [
      {
        key: 'percent',
        label: 'Percentage Field',
        type: 'col-select',
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
      percent: z.string(),
      radius: z.coerce.number().min(0.1).max(1).default(0.9),
    }),
  },
  SCATTER_CHART: {
    type: 'SCATTER_CHART',
    Component: Scatter,
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
        key: 'colorField',
        label: 'Color Field',
        type: 'col-select',
      },
      {
        key: 'appendPadding',
        label: 'Append Padding',
        type: 'number',
      },
      {
        key: 'size',
        label: 'Size',
        type: 'slider',
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 2,
      },
      {
        key: 'shape',
        label: 'Shape',
        type: 'select',
        options: SHAPES.map((shape) => ({ id: shape, label: shape })),
        defaultValue: 'circle',
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      colorField: z.string().optional(),
      appendPadding: z.coerce.number().optional(),
      size: z.number().min(2).max(10).default(2),
      shape: z.string().optional(),
    }),
  },
  HEAT_MAP: {
    type: 'HEAT_MAP',
    Component: Heatmap,
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
        key: 'colorField',
        label: 'Color Field',
        type: 'col-select',
      },
      {
        key: 'shape',
        label: 'Shape',
        type: 'select',
        options: [...SHAPES, 'rectangle'].map((shape) => ({ id: shape, label: shape })),
        defaultValue: 'rectangle',
      },
      {
        key: 'sizeRatio',
        label: 'Size Ratio',
        type: 'slider',
        min: 0.1,
        max: 1,
        step: 0.1,
        defaultValue: 0.5,
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['default', 'polar'].map((type) => ({ id: type, label: type })),
        defaultValue: 'default',
      },
      {
        key: 'innerRadius',
        label: 'Inner Radius',
        type: 'slider',
        min: 0.1,
        max: 1,
        step: 0.1,
        defaultValue: 0.2,
      },
    ],
    validationSchema: z.object({
      xField: z.string(),
      yField: z.string(),
      colorField: z.string(),
      shape: z.string().optional(),
      sizeRatio: z.number().min(0.1).max(1).default(0.5).optional(),
      type: z.string().default('default').optional(),
      innerRadius: z.number().min(0.1).max(1).default(0.2).optional(),
    }),
  },
  STAT_CARD: {
    type: 'STAT_CARD',
    Component: StatsCard,
    inputs: [
      {
        key: 'dataField',
        label: 'Data Field',
        type: 'col-select',
      },
      {
        key: 'nameField',
        label: 'Name Field',
        type: 'col-select',
      },
      {
        key: 'unit',
        label: 'Unit',
        type: 'text',
      },
    ],
    validationSchema: z.object({
      dataField: z.string(),
      nameField: z.string(),
      unit: z.string().optional(),
    }),
  },
}

export function getConfigFromValues(
  chartType: QueryChartType,
  chartConfig: Record<string, string | number | boolean>,
  queryResult: Record<string, string | number | string[]>[],
): Record<string, any> {
  switch (chartType) {
    case 'BAR_CHART': {
      return {
        ...chartConfig,
        legend: chartConfig.legend
          ? {
              position: chartConfig.legendPosition,
            }
          : chartConfig.legend,
      }
    }

    case 'COLUMN_CHART': {
      return {
        ...chartConfig,
        legend: chartConfig.legend
          ? {
              position: chartConfig.legendPosition,
            }
          : chartConfig.legend,
      }
    }

    case 'PIE_CHART': {
      return { ...chartConfig, label: { type: chartConfig.labelType } }
    }

    case 'LINE_CHART': {
      return chartConfig
    }

    case 'GAUGE_CHART': {
      const item = queryResult[0]

      return {
        ...chartConfig,
        percent: item[chartConfig.percent as string],
      }
    }

    case 'HEAT_MAP': {
      return {
        ...chartConfig,
        coordinate:
          chartConfig.type === 'polar'
            ? {
                type: 'polar',
                cfg: {
                  innerRadius: chartConfig.innerRadius,
                },
              }
            : undefined,
        meta: {
          [chartConfig.xField as string]: {
            type: 'cat',
          },
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
      }
    }

    default: {
      return chartConfig
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
