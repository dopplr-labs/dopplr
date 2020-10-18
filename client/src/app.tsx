import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from './components/nav-bar'
import SideBar from './components/side-bar'
import Queries from './pages/queries'
import Resources from './pages/resources'

export function App() {
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
