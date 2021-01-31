export enum ChartType {
  LINE = 'line',
  SMOOTH_LINE = 'smoothLine',
  AREA = 'area',
  STACKED_AREA = 'stackedArea',
  STACKED_AREA_100 = 'stackedArea100',
  COLUMN = 'column',
  STACKED_COLUMN = 'stackedColumn',
  STACKED_COLUMN_100 = 'stackedColumn100',
  BAR = 'bar',
  STACKED_BAR = 'stackedBar',
  STACKED_BAR_100 = 'stackedBar100',
  PIE = 'pie',
  RING = 'ring',
  SCATTER = 'scatter',
}

export type Chart = {
  id: number
  name: string
  label: string
  values: string[]
  type: ChartType
  query: number
}
