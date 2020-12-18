import React, { useContext } from 'react'
import { Navigate, Route as ReactRouterRoute } from 'react-router-dom'
import AuthContext from 'contexts/auth-context'

type RouteProps = React.ComponentProps<typeof ReactRouterRoute> & {
  protectedRoute?: boolean
}

export default function Route({ protectedRoute, ...routeProps }: RouteProps) {
  const { user } = useContext(AuthContext)

  if (protectedRoute && !user) {
    return <Navigate to={{ pathname: '/login' }} />
  }

  return <ReactRouterRoute {...routeProps} />
}
