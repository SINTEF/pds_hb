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
import { PersonalUserPage } from './pages/personal-user-page'
import { AdminPage } from './pages/admin-page'
import { CompanyUserPage } from './pages/company-user-page'
import { AddComponentPage } from './pages/add-component-page'
import { RegisterNewUserPage } from './pages/register-new-user/idex'
import { NotificationPage } from './pages/notification-page'
import { AddNotificationsPage } from './pages/add-notifications-page'
import { InventoryPage } from './pages/inventory-page'
import { AddInventoryPage } from './pages/add-inventory-page'
import { UpdateNotificationPage } from './pages/update-notification-page'
import { UpdateInventoryPage } from './pages/update-inventory-page'
import { AnalysisPage } from './pages/analysis-page'
import { AddCommonFailurePage } from './pages/add-commonFailure-page'
import { AddRepeatingFailurePage } from './pages/add-repeatingFailure-page'
import { PeriodPage } from './pages/period-page'
import { AllEditsPage } from './pages/admin-all-edits-page'

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
            <Route path={MAIN_ROUTES.REGISTER}>
              <RegisterNewUserPage />
            </Route>
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
            <AuthRoute path={MAIN_ROUTES.ACCOUNT}>
              <PersonalUserPage />
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
            <AuthRoute exact path={MAIN_ROUTES.NOTIFICATIONS}>
              <NotificationPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.ADD_NOTIFICATIONS}>
              <AddNotificationsPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.ADD_COMMON_CAUSE_FAILURE}>
              <AddCommonFailurePage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.ADD_REPEATING_FAILURE}>
              <AddRepeatingFailurePage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.EDIT_NOTIFICATION}>
              <UpdateNotificationPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.INVENTORY}>
              <InventoryPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.EDIT_INVENTORY}>
              <UpdateInventoryPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.ADD_INVENTORY}>
              <AddInventoryPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.PERIODS}>
              <PeriodPage />
            </AuthRoute>
            <AuthRoute exact path={MAIN_ROUTES.ANALYSIS}>
              <AnalysisPage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.ADD}>
              <AddDataPage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.ADD_COMPONENT}>
              <AddComponentPage />
            </AuthRoute>
            <AuthRoute path={MAIN_ROUTES.SEE_ALL_EDITS}>
              <AllEditsPage />
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
