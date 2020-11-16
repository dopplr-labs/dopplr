import Axios from 'axios'
import { Query } from 'types/query'

const client = Axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

export async function runQuery({
  resource,
  query,
}: {
  resource: number
  query: string
}) {
  const { data } = await client.post<{ success: boolean; data: Query }>(
    'http://localhost:3001/queries/run',
    {
      resource,
      query,
    },
  )
  return data.data
}
