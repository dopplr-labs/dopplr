import React from 'react'
import { useParams, useNavigate, useMatch } from 'react-router-dom'
import { Subtract } from 'utility-types'

type RouteParamsProps = {
  params: ReturnType<typeof useParams>
}

export function withRouteParams<Props extends RouteParamsProps>(
  WrappingComponent: React.ComponentType<Props>,
): React.ComponentType<Subtract<Props, RouteParamsProps>> {
  function WrappedComponent(props: Subtract<Props, RouteParamsProps>) {
    const params = useParams()
    return <WrappingComponent {...(props as Props)} params={params} />
  }

  WrappedComponent.displayName = `withRouteParams(${WrappingComponent.displayName})`

  return WrappedComponent
}

export type NavigateFunction = ReturnType<typeof useNavigate>

type NavigationProps = {
  navigate: NavigateFunction
}

export function withNavigate<Props extends NavigationProps>(
  WrappingComponent: React.ComponentType<Props>,
): React.ComponentType<Subtract<Props, NavigationProps>> {
  function WrappedComponent(props: Subtract<Props, NavigationProps>) {
    const navigate = useNavigate()
    return <WrappingComponent {...(props as Props)} navigate={navigate} />
  }

  WrappedComponent.displayName = `withNavigation(${WrappingComponent.displayName})`

  return WrappedComponent
}

export type RouteMatch = ReturnType<typeof useMatch>

type RouteMatchProps = {
  match: RouteMatch
}

export function withRouteMatch<Props extends RouteMatchProps>(
  WrappingComponent: React.ComponentType<Props>,
  pattern: string,
): React.ComponentType<Subtract<Props, RouteMatchProps>> {
  function WrappedComponent(props: Subtract<Props, RouteMatchProps>) {
    const match = useMatch(pattern)
    return <WrappingComponent {...(props as Props)} match={match} />
  }

  WrappedComponent.displayName = `withRouteMatch(${WrappingComponent.displayName})`

  return WrappedComponent
}
