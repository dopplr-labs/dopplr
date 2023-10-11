import { QUERY_CHARTS } from '@/lib/query-chart/utils'

export type QueryChartType = (typeof QUERY_CHARTS)[number]['id']

type BaseInput = {
  key: string
  label: string
  required: boolean
}

type ColSelectInput = BaseInput & {
  type: 'col-select'
}

export type QueryChartConfigInput = ColSelectInput

export type QueryChartConfig = {
  type: QueryChartType
  Component: React.ForwardRefExoticComponent<any>
  inputs: QueryChartConfigInput[]
}
