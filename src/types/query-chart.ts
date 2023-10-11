import z from 'zod'
import { QUERY_CHARTS } from '@/lib/query-chart/utils'

export type QueryChartType = (typeof QUERY_CHARTS)[number]['id']

type BaseInput = {
  key: string
  label: string
}

type ColSelectInput = BaseInput & {
  type: 'col-select'
}

type BooleanInput = BaseInput & {
  type: 'boolean'
}

export type QueryChartConfigInput = ColSelectInput | BooleanInput

export type QueryChartConfig = {
  type: QueryChartType
  Component: React.ForwardRefExoticComponent<any>
  inputs: QueryChartConfigInput[]
  validationSchema: z.ZodSchema
}
