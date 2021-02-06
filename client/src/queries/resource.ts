import { Resource } from 'types/resource'
import { SchemaResult } from 'types/schema'
import client from 'utils/client'

export async function fetchSchema(id: number) {
  const { data } = await client.get<{
    success: boolean
    data: SchemaResult[]
  }>(`/resources/schema/${id}`)
  return data.data
}

export async function fetchResource(resourceId: string): Promise<Resource> {
  const { data } = await client.get<{ success: boolean; data: Resource }>(
    `/resources/${resourceId}`,
  )
  return data.data
}
