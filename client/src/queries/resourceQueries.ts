import Axios from 'axios'
import { Resource } from '../types/resource'

const client = Axios.create({ baseURL: 'http://localhost:3001/' })

export async function fetchResources(): Promise<Resource[]> {
  const { data } = await client.get<Resource[]>('/connections')
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
}: {
  name: string
  type: string
  host: string
  port: number
  database?: string
  username?: string
  password?: string
}): Promise<Resource> {
  const { data } = await client.post<Resource>('/connections', {
    name,
    type,
    host,
    port,
    database,
    username,
    password,
  })
  return data
}

export async function updateResource({
  id,
  name,
  host,
  port,
  database,
  username,
  password,
}: {
  id: number
  name?: string
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
}): Promise<Resource> {
  const { data } = await client.patch<Resource>(`/connections/${id}`, {
    name,
    host,
    port,
    database,
    username,
    password,
  })
  return data
}

export async function deleteResource({
  id,
}: {
  id: number
}): Promise<Resource> {
  const { data } = await client.delete<Resource>(`/connections/${id}`)
  return data
}
