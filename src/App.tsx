import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, Options } from 'use-http'

import './App.css'
import { BrowseComponentPage } from './pages/browse-component-page'
import { ChooseComponentPage } from './pages/choose-component-page'
import { Login } from './pages/login'
import MAIN_ROUTES, { SUB_ROUTES } from './routes/routes.constants'
import { Header } from './components/header'
import { NotFound } from './pages/not-found'
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
            <AuthRoute exact path={MAIN_ROUTES.HOME}>
              <p>Home</p>
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.BROWSE}>
              <Switch>
                <AuthRoute path={SUB_ROUTES.CHOOSE_COMP}>
                  <ChooseComponentPage />
                </AuthRoute>
                <AuthRoute path={SUB_ROUTES.VIEW}>
                  <BrowseComponentPage />
                </AuthRoute>
              </Switch>
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
