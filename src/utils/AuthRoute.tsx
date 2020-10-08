import React from 'react'

import { Route, Redirect, RouteProps } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'

export interface AuthRouteProps extends RouteProps {
  path: string
}

export const AuthRoute: React.FC<AuthRouteProps> = ({
  component,
  ...rest
}: AuthRouteProps) => {
  const { storedValue: token } = useLocalStorage('token', '')
  return token ? (
    <Route {...rest} component={component} />
  ) : (
    <Redirect to="/login" />
  )
}
