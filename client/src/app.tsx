import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { message } from 'antd'
import { ReactQueryDevtools } from 'react-query-devtools'
import AppShell from 'components/app-shell'
import Resources from 'pages/resources'
import Queries from 'pages/queries'
import Dashboards from 'pages/dashboards'
import Home from 'pages/home'
import QueryTabs from 'components/query-tabs'

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
      <QueryTabs>
        <Routes>
          <Route element={<AppShell />} path="/">
            <Route element={<Home />} path="/" />
            <Route element={<Resources />} path="resources*" />
            <Route element={<Queries />} path="queries" />
            <Route element={<Dashboards />} path="dashboards" />
          </Route>
        </Routes>
      </QueryTabs>
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </>
  )
}
