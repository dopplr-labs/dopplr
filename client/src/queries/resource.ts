import { SchemaResult } from 'types/schema'
import client from 'utils/client'

export async function fetchSchema(id: number) {
  const { data } = await client.get<{
    success: boolean
    data: SchemaResult[]
  }>(`/resources/schema/${id}`)
  return data.data
}
