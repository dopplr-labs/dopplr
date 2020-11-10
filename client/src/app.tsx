import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { message } from 'antd'
import NavBar from './components/nav-bar'
import SideBar from './components/side-bar'
import Queries from './pages/queries'
import Resources from './pages/resources'

async function fetchHealthStatus() {
  const { data } = await axios.get('/health/knock-knock', {
    baseURL: process.env.REACT_APP_API_BASE_URL,
  })
  return data
}

export function App() {
  const { data, error } = useQuery('health', fetchHealthStatus, {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data) {
      message.success('Server working fine')
    } else if (error) {
      message.error('Server not working')
    }
  }, [data, error])

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <NavBar />
      <div className="flex flex-1 overflow-hidden bg-white">
        <SideBar />
        <div className="flex-1 overflow-auto">
          <Switch>
            <Route path="/resources/:resourceId?" component={Resources} />
            <Route path="/queries/:queriesId?" component={Queries} />
          </Switch>
        </div>
      </div>
    </div>
  )
}
