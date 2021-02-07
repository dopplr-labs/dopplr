import { Category } from './category'
import { Chart } from './chart'

export type Layout = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export type DashboardChart = {
  id: number
  chart: Chart
}

export type Dashboard = {
  id: number
  name: string
  description?: string
  charts?: DashboardChart[]
  layout?: Layout[]
  category: Category
}
