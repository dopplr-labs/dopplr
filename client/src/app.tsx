import React, { Suspense, lazy } from 'react'
import { Navigate, Routes } from 'react-router-dom'
import { useQuery } from 'react-query'
import { message, Spin } from 'antd'
import { ReactQueryDevtools } from 'react-query-devtools'
import Route from 'components/route'
import Auth from 'components/auth'
import Settings from 'components/settings'
import AppShell from 'components/app-shell'
import Home from 'pages/home'
import ResourcesList from 'pages/resources/components/resources-list'
import CreateResource from 'pages/resources/components/create-resource'
import ResourceDetail from 'pages/resources/components/resource-detail'
import UnsavedQueryEditorTab from 'pages/queries/components/unsaved-query-editor-tab'
import HistoryEditorTab from 'pages/queries/components/history-editor-tab'
import SavedQueryEditorTab from 'pages/queries/components/saved-query-editor-tab'
import Dashboards from 'pages/dashboards'
import EmptyDashboard from 'pages/dashboards/components/empty-dashboard'
import TextEditorSettings from 'pages/settings-panel/components/text-editor-settings'
import client from 'utils/client'
import Logrocket from 'components/logrocket'

async function fetchHealthStatus() {
  const { data } = await client.get('/health/knock-knock')
  return data
}

const SHOW_DEV_TOOLS = false

const Login = lazy(() => import('pages/login'))
const Queries = lazy(() => import('pages/queries'))
const Resources = lazy(() => import('pages/resources'))
const SettingsPanel = lazy(() => import('pages/settings-panel'))

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
        <Settings>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-screen h-screen">
                <Spin tip="Loading..." />
              </div>
            }
          >
            <Routes>
              <Route element={<Login />} path="/login" />
              <Route protectedRoute element={<AppShell />} path="/">
                <Route protectedRoute element={<Home />} path="/" />
                <Route protectedRoute element={<Resources />} path="resources">
                  <Route protectedRoute path="/" element={<ResourcesList />} />
                  <Route
                    path="new/:resourceType"
                    element={<CreateResource />}
                  />
                  <Route path=":resourceId" element={<ResourceDetail />} />
                </Route>
                <Route protectedRoute element={<Queries />} path="queries">
                  <Route
                    path="new/:tabId"
                    element={<UnsavedQueryEditorTab />}
                  />
                  <Route
                    path="history/:historyId"
                    element={<HistoryEditorTab />}
                  />
                  <Route
                    path="saved/:queryId"
                    element={<SavedQueryEditorTab />}
                  />
                </Route>
                <Route
                  protectedRoute
                  element={<Dashboards />}
                  path="dashboards"
                >
                  <Route protectedRoute element={<EmptyDashboard />} path="/" />
                </Route>
                <Route
                  protectedRoute
                  element={<SettingsPanel />}
                  path="settings"
                >
                  <Route
                    path="/"
                    element={<Navigate to="text-editor" replace={true} />}
                  />
                  <Route path="text-editor" element={<TextEditorSettings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
          </Suspense>
          {process.env.NODE_ENV === 'production' && <Logrocket />}
        </Settings>
      </Auth>
      {process.env.NODE_ENV === 'development' && SHOW_DEV_TOOLS ? (
        <ReactQueryDevtools />
      ) : null}
    </>
  )
}
