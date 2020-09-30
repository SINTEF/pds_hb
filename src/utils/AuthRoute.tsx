import React from 'react'

import { Route, Redirect, RouteProps } from 'react-router-dom'

export interface AuthRouteProps extends RouteProps {
  path: string
}

export const AuthRoute: React.FC<AuthRouteProps> = ({
  component,
  ...rest
}: AuthRouteProps) => {
  const auth = false
  return auth ? (
    <Route {...rest} component={component} />
  ) : (
    <Redirect to="/login" />
  )
}
