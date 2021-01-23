import { useQuery } from 'react-query'
import { message } from 'antd'
import client from 'utils/client'

async function fetchHealthStatus() {
  const { data } = await client.get('/health/knock-knock')
  return data
}

export default function HealthCheck() {
  useQuery('health', fetchHealthStatus, {
    refetchOnWindowFocus: false,
    onSuccess: () => {
      message.success('Server working fine')
    },
    onError: () => {
      message.error('Server not working')
    },
  })

  return null
}
