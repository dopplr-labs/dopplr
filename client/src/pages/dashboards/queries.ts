import { Category, Dashboard, DashboardChart } from 'types/dashboard'
import client from 'utils/client'

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get<{ success: boolean; data: Category[] }>(
    '/dashboards/categories',
  )
  return data.data
}

export async function fetchDashboard(id: number): Promise<Dashboard> {
  const { data } = await client.get<{ success: boolean; data: Dashboard }>(
    `/dashboards/${id}`,
  )
  return data.data
}

export async function fetchDashboardChart(id: number): Promise<DashboardChart> {
  const { data } = await client.get<{ success: boolean; data: DashboardChart }>(
    `/dashboard-charts/${id}`,
  )
  return data.data
}
