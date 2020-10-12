import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, Options } from 'use-http'

import './App.css'
import { Login } from './pages/login'
import { Read } from './pages/read'
import MAIN_ROUTES from './routes/routes.constants'
import { AuthRoute } from './utils/AuthRoute'
import { UserProvider } from './utils/context/userContext'
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
      <UserProvider>
        <BrowserRouter>
          <Switch>
            <Route path={MAIN_ROUTES.LOGIN}>
              <Login />
            </Route>
            <Route path={MAIN_ROUTES.READ}>
              <Read />
            </Route>
            <AuthRoute path={MAIN_ROUTES.HOME}>
              <p>Home</p>
            </AuthRoute>
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </Provider>
  )
}

export default App
