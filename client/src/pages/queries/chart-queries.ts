import { Chart } from 'types/chart'
import client from 'utils/client'

export async function fetchCharts(): Promise<Chart[]> {
  const { data } = await client.get<{ success: boolean; data: Chart[] }>(
    '/charts',
  )
  return data.data
}

export async function fetchChartsForQuery(queryId: number): Promise<Chart[]> {
  const { data } = await client.get<{ success: boolean; data: Chart[] }>(
    `/charts?query=${queryId}`,
  )
  return data.data
}

export async function fetchChart(chartId: string): Promise<Chart> {
  const { data } = await client.get<{ success: boolean; data: Chart }>(
    `/charts/${chartId}`,
  )
  return data.data
}

export async function createChart({
  name,
  label,
  values,
  type,
  query,
}: Partial<Chart>): Promise<Chart> {
  const { data } = await client.post<{ success: boolean; data: Chart }>(
    '/charts',
    { name, label, values, type, query },
  )
  return data.data
}

export async function updateChart({
  name,
  label,
  values,
  type,
  query,
}: Partial<Chart>): Promise<Chart> {
  const { data } = await client.post<{ success: boolean; data: Chart }>(
    '/charts',
    { name, label, values, type, query },
  )
  return data.data
}

export async function deleteChart({ id }: { id: number }): Promise<Chart> {
  const { data } = await client.delete<{ success: boolean; data: Chart }>(
    `/charts/${id}`,
  )
  return data.data
}
