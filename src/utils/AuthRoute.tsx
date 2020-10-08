import React from 'react'

import { Route, Redirect, RouteProps } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
import jwt_decode from 'jwt-decode'

export interface AuthRouteProps extends RouteProps {
  path: string
}

export const AuthRoute: React.FC<AuthRouteProps> = ({
  component,
  ...rest
}: AuthRouteProps) => {
  const { storedValue: token } = useLocalStorage('token', '')
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken = jwt_decode(token) as any
    const expiration = new Date(decodedToken.exp)
    const valid = expiration > new Date()
    if (valid) {
      return <Route {...rest} component={component} />
    }
  }
  return <Redirect to="/login" />
}
