import { Dashboard, DashboardChart } from 'types/dashboard'
import { Category } from 'types/category'
import client from 'utils/client'

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get<{ success: boolean; data: Category[] }>(
    '/dashboards/categories',
  )
  return data.data
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  const { data } = await client.get<{ success: boolean; data: Dashboard[] }>(
    '/dashboards',
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

export async function createCategory({
  name,
}: Partial<Category>): Promise<Category> {
  const { data } = await client.post<{ success: true; data: Category }>(
    '/dashboards/categories',
    { name },
  )
  return data.data
}

export async function createDashboard({
  name,
  description,
  category,
}: Partial<Dashboard>): Promise<Dashboard> {
  const { data } = await client.post<{ success: boolean; data: Dashboard }>(
    '/dashboards',
    {
      name,
      description,
      category,
    },
  )
  return data.data
}
