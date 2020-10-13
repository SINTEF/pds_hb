import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, Options } from 'use-http'

import './App.css'
import { Frontpage } from './pages/frontpage'
import { Header } from './components/header'
import { Login } from './pages/login'
import { Read } from './pages/read'
import { NotFound } from './pages/not-found'
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
          <Header />
          <Switch>
            <Route path={MAIN_ROUTES.LOGIN}>
              <Login />
            </Route>
            <AuthRoute path={MAIN_ROUTES.READ}>
              <Read />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.HOME}>
              <Frontpage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.NOT_FOUND}>
              <NotFound />
            </AuthRoute>
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </Provider>
  )
}

export default App
