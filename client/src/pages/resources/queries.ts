import Axios from 'axios'
import { Resource } from 'types/resource'

const client = Axios.create({ baseURL: 'http://localhost:3001/' })

export async function fetchResources(): Promise<Resource[]> {
  const { data } = await client.get<{ success: boolean; data: Resource[] }>(
    '/resources',
  )
  return data.data
}

export async function fetchResource(resourceId: string): Promise<Resource> {
  const { data } = await client.get<{ success: boolean; data: Resource }>(
    `/resources/${resourceId}`,
  )
  return data.data
}

export async function testResourceConnection({
  name,
  type,
  host,
  port,
  database,
  username,
  password,
}: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
  success: boolean
  message: string
}> {
  const { data } = await client.post<{ success: boolean; message: string }>(
    '/resources/test',
    {
      name,
      type,
      host,
      port,
      database,
      username,
      password,
    },
  )
  return data
}

export async function testSavedResource(
  resource: number,
): Promise<{
  success: boolean
  message: string
}> {
  const { data } = await client.post<{ success: boolean; message: string }>(
    '/resources/test-saved',
    {
      resource,
    },
  )
  return data
}

export async function createResource({
  name,
  type,
  host,
  port,
  database,
  username,
  password,
}: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
  const { data } = await client.post<{ success: boolean; data: Resource }>(
    '/resources',
    {
      name,
      type,
      host,
      port,
      database,
      username,
      password,
    },
  )
  return data.data
}

export async function updateResource({
  id,
  name,
  host,
  port,
  database,
  username,
  password,
}: Partial<Resource>): Promise<Resource> {
  const { data } = await client.patch<{ success: boolean; data: Resource }>(
    `/resources/${id}`,
    {
      name,
      host,
      port,
      database,
      username,
      password,
    },
  )
  return data.data
}

export async function deleteResource({
  id,
}: {
  id: number
}): Promise<Resource> {
  const { data } = await client.delete<{ success: boolean; data: Resource }>(
    `/resources/${id}`,
  )
  return data.data
}
