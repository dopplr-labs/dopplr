import GridLayout from 'react-grid-layout'
import { Category } from './category'
import { DashboardChart } from './dashboard-chart'

export type Dashboard = {
  id: number
  name: string
  description?: string
  charts?: DashboardChart[]
  layout?: GridLayout.Layout[]
  category: Category
}
