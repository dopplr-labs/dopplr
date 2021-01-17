export type ChartTypes =
  | 'line'
  | 'smoothLine'
  | 'area'
  | 'stackedArea'
  | 'stackedArea100'
  | 'column'
  | 'stackedColumn'
  | 'stackedColumn100'
  | 'bar'
  | 'stackedBar'
  | 'stackedBar100'
  | 'pie'
  | 'ring'
  | 'scatter'

export type Chart = {
  id: number
  name: string
  label: string
  values: string[]
  type: ChartTypes
  query: number
}
