import { Resource } from 'types/resource'
import client from 'utils/client'

export async function fetchResources(): Promise<Resource[]> {
  const { data } = await client.get<{ success: boolean; data: Resource[] }>(
    '/resources',
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
  sslRequired,
  selfCertificate,
  clientKey,
  clientCertificate,
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
      sslRequired,
      selfCertificate,
      clientKey,
      clientCertificate,
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
  sslRequired,
  selfCertificate,
  clientKey,
  clientCertificate,
}: Partial<Resource>): Promise<Resource> {
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
      sslRequired,
      selfCertificate,
      clientKey,
      clientCertificate,
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
  sslRequired,
  selfCertificate,
  clientKey,
  clientCertificate,
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
      sslRequired,
      selfCertificate,
      clientKey,
      clientCertificate,
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
