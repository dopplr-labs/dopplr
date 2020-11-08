import Axios from 'axios'

const client = Axios.create({ baseURL: 'http://localhost:3001/' })

export const fetchResources = async () => {
  const { data } = await client.get('/connections')
  return data
}

export const createResource = async ({
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
}) => {
  const { data } = await client.post('/connections', {
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

export const updateResource = async ({
  id,
  name,
  host,
  port,
  database,
  username,
  password,
}: {
  id: string
  name?: string
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
}) => {
  const { data } = await client.patch(`/connections/${id}`, {
    name,
    host,
    port,
    database,
    username,
    password,
  })
  return data
}

export const deleteResource = async ({ id }: { id: string }) => {
  const { data } = await client.delete(`/connections/${id}`)
  return data
}
