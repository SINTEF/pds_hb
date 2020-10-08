import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, Options } from 'use-http'

import './App.css'
import { Login } from './pages/login'
import { AuthRoute } from './utils/AuthRoute'
import useLocalStorage from './utils/hooks/useLocalStorage'

function App(): JSX.Element {
  const { storedValue: token } = useLocalStorage<string>('token', '')

  const options: Partial<Options> = {
    interceptors: {
      // every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      request: ({ options }) => {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }

        return options
      },
    },
  }
  return (
    <Provider
      url={process.env.REACT_APP_API_URL || 'http://localhost:5000'}
      options={options}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <AuthRoute path="/">
            <p>Home</p>
          </AuthRoute>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}

export default App
