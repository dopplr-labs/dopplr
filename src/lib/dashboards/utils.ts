import ReactGridLayout from 'react-grid-layout'
import { Chart } from '@/db/schema/charts'
import { QueryChartType } from '@/types/query-chart'

type ChartDimension = {
  h: number
  w: number
}

export const CHART_DEFAULT_DIMENSIONS: Record<QueryChartType, ChartDimension> = {
  AREA_CHART: {
    w: 3,
    h: 3,
  },
  BAR_CHART: {
    w: 3,
    h: 3,
  },
  COLUMN_CHART: {
    w: 5,
    h: 8,
  },
  GAUGE_CHART: {
    w: 3,
    h: 3,
  },
  HEAT_MAP: {
    w: 3,
    h: 3,
  },
  LINE_CHART: {
    w: 3,
    h: 3,
  },
  PIE_CHART: {
    w: 5,
    h: 6,
  },
  SCATTER_CHART: {
    w: 3,
    h: 3,
  },
  STAT_CARD: {
    w: 3,
    h: 3,
  },
}

export function generateDefaultLayout(charts: Chart[]): ReactGridLayout.Layout[] {
  return charts.map((chart) => {
    const dimension = CHART_DEFAULT_DIMENSIONS[chart.type!]

    return {
      i: chart.id.toString(),
      x: 0,
      y: 0,
      ...dimension,
    }
  })
}
