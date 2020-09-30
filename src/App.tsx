import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import './App.css'
import { Login } from './pages/login'
import { AuthRoute } from './utils/AuthRoute'

function App(): JSX.Element {
  return (
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
  )
}

export default App
