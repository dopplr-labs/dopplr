import { To, State } from 'history'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Subtract } from 'utility-types'

type RouteParamsProps = {
  params: Record<string, string>
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

export type NavigateFunction = {
  (
    to: To,
    options?: {
      replace?: boolean
      state?: State
    },
  ): void
  (delta: number): void
}

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

  WrappedComponent.displayName = `withRouteParams(${WrappingComponent.displayName})`

  return WrappedComponent
}
