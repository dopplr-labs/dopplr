import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { message } from 'antd'
import { ReactQueryDevtools } from 'react-query-devtools'
import AppShell from 'components/app-shell'
import Resources from 'pages/resources'
import Queries from 'pages/queries'

async function fetchHealthStatus() {
  const { data } = await axios.get('/health/knock-knock', {
    baseURL: process.env.REACT_APP_API_BASE_URL,
  })
  return data
}

export function App() {
  const { data, error } = useQuery('health', fetchHealthStatus, {
    refetchOnWindowFocus: false,
    enabled: process.env.NODE_ENV === 'development',
  })

  useEffect(() => {
    if (data) {
      message.success('Server working fine')
    } else if (error) {
      message.error('Server not working')
    }
  }, [data, error])

  return (
    <>
      <Routes>
        <Route element={<AppShell />} path="/">
          <Route element={<Resources />} path="resources*" />
          <Route element={<Queries />} path="queries" />
        </Route>
      </Routes>
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </>
  )
}
