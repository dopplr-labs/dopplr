import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { message } from 'antd'
import { ReactQueryDevtools } from 'react-query-devtools'
import AppShell from 'components/app-shell'
import Home from 'pages/home'
import Resources from 'pages/resources'
import ResourcesList from 'pages/resources/components/resources-list'
import CreateResource from 'pages/resources/components/create-resource'
import ResourceDetail from 'pages/resources/components/resource-detail'
import Queries from 'pages/queries'
import UnsavedQueryEditorTab from 'pages/queries/components/unsaved-query-editor-tab'
import HistoryEditorTab from 'pages/queries/components/history-editor-tab'
import SavedQueryEditorTab from 'pages/queries/components/saved-query-editor-tab'
import Dashboards from 'pages/dashboards'

async function fetchHealthStatus() {
  const { data } = await axios.get('/health/knock-knock', {
    baseURL: process.env.REACT_APP_API_BASE_URL,
  })
  return data
}

const SHOW_QUERY_DEV_TOOL = false

export function App() {
  useQuery('health', fetchHealthStatus, {
    refetchOnWindowFocus: false,
    enabled: process.env.NODE_ENV === 'development',
    onSuccess: () => {
      message.success('Server working fine')
    },
    onError: () => {
      message.error('Server not working')
    },
  })

  const location = useLocation()

  return (
    <>
      <Routes>
        <Route element={<AppShell />} path="/">
          <Route element={<Home />} path="/" />
          <Route element={<Resources />} path="resources">
            <Route path="/" element={<ResourcesList />} />
            <Route path="new/:resourceType" element={<CreateResource />} />
            <Route path=":resourceId" element={<ResourceDetail />} />
          </Route>
          <Route element={<Queries />} path="queries">
            <Route
              path="new/:tabId"
              element={<UnsavedQueryEditorTab key={location.pathname} />}
            />
            <Route
              path="history/:historyId"
              element={<HistoryEditorTab key={location.pathname} />}
            />
            <Route
              path="saved/:queryId"
              element={<SavedQueryEditorTab key={location.pathname} />}
            />
          </Route>
          <Route element={<Dashboards />} path="dashboards" />
        </Route>
      </Routes>
      {process.env.NODE_ENV === 'development' && SHOW_QUERY_DEV_TOOL ? (
        <ReactQueryDevtools />
      ) : null}
    </>
  )
}
