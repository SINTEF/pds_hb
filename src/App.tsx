import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider, Options } from 'use-http'

import './App.css'
import { Frontpage } from './pages/frontpage'
import { Login } from './pages/login'
import { Read } from './pages/read'
import { Header } from './components/header'
import { NotFound } from './pages/not-found'
import MAIN_ROUTES from './routes/routes.constants'
import { AuthRoute } from './utils/AuthRoute'
import { UserProvider } from './utils/context/userContext'
import { AddDataPage } from './pages/add-data-page'
import useLocalStorage from './utils/hooks/useLocalStorage'
import { Browse } from './pages/browse-page'
import { CompanyPage } from './pages/company-page'
import { AdminPage } from './pages/admin-page'
import { CompanyUserPage } from './pages/company-user-page'

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
            <AuthRoute path={MAIN_ROUTES.BROWSE}>
              <Browse />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.READ}>
              <Read />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.COMPANY}>
              <CompanyPage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.ADMIN}>
              <AdminPage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.ADMIN_COMPANY}>
              <CompanyUserPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.HOME}>
              <Frontpage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.ADD}>
              <AddDataPage />
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
