import z from 'zod'
import { QUERY_CHARTS } from '@/lib/query-chart/utils'

export type QueryChartType = (typeof QUERY_CHARTS)[number]['id']

type BaseInput = {
  key: string
  label: string
  description?: string
  defaultValue?: any
}

type ColSelectInput = BaseInput & {
  type: 'col-select'
}

type BooleanInput = BaseInput & {
  type: 'boolean'
}

type SelectInput = BaseInput & {
  type: 'select'
  options: Array<{ id: string; label: string }>
}

type NumberInput = BaseInput & {
  type: 'number'
}

type SliderInput = BaseInput & {
  type: 'slider'
  min: number
  max: number
  step: number
}

export type QueryChartConfigInput = ColSelectInput | BooleanInput | SelectInput | NumberInput | SliderInput

export type QueryChartConfig = {
  type: QueryChartType
  Component: React.ForwardRefExoticComponent<any>
  inputs: QueryChartConfigInput[]
  validationSchema: z.ZodObject<z.ZodRawShape>
}
