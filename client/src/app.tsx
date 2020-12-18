import React from 'react'
import { Navigate, Routes } from 'react-router-dom'
import { useQuery } from 'react-query'
import { message } from 'antd'
import { ReactQueryDevtools } from 'react-query-devtools'
import Route from 'components/route'
import Auth from 'components/auth'
import AppShell from 'components/app-shell'
import Login from 'pages/login'
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
import Settings from 'pages/settings'
import TextEditorSettings from 'pages/settings/components/text-editor-settings'
import WorkbenchSettings from 'pages/settings/components/workbench-settings'
import client from 'utils/client'

async function fetchHealthStatus() {
  const { data } = await client.get('/health/knock-knock')
  return data
}

const SHOW_DEV_TOOLS = false

export function App() {
  useQuery('health', fetchHealthStatus, {
    refetchOnWindowFocus: false,
    enabled: process.env.NODE_ENV === 'development' && SHOW_DEV_TOOLS,
    onSuccess: () => {
      message.success('Server working fine')
    },
    onError: () => {
      message.error('Server not working')
    },
  })

  return (
    <>
      <Auth>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route protectedRoute element={<AppShell />} path="/">
            <Route protectedRoute element={<Home />} path="/" />
            <Route protectedRoute element={<Resources />} path="resources">
              <Route protectedRoute path="/" element={<ResourcesList />} />
              <Route path="new/:resourceType" element={<CreateResource />} />
              <Route path=":resourceId" element={<ResourceDetail />} />
            </Route>
            <Route protectedRoute element={<Queries />} path="queries">
              <Route path="new/:tabId" element={<UnsavedQueryEditorTab />} />
              <Route path="history/:historyId" element={<HistoryEditorTab />} />
              <Route path="saved/:queryId" element={<SavedQueryEditorTab />} />
            </Route>
            <Route protectedRoute element={<Dashboards />} path="dashboards" />
            <Route protectedRoute element={<Settings />} path="settings">
              <Route
                path="/"
                element={<Navigate to="text-editor" replace={true} />}
              />
              <Route path="text-editor" element={<TextEditorSettings />} />
              <Route path="workbench" element={<WorkbenchSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Auth>
      {process.env.NODE_ENV === 'development' && SHOW_DEV_TOOLS ? (
        <ReactQueryDevtools />
      ) : null}
    </>
  )
}
