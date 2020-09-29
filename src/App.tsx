import React from 'react'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import './App.css'
import { Login } from './pages/login'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signin">
          <Login />
        </Route>
        <Route path="/">
          <p>Home</p>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
