import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { ChooseComponentPage } from '../choose-component-page'
import { BrowseComponentPage } from '../browse-component-page'
import { SUB_ROUTES } from '../../routes/routes.constants'

export const Browse: React.FC = () => {
  return (
    <div>
      <Switch>
        <Route to={[SUB_ROUTES.CHOOSE_COMP, '/']}>
          <ChooseComponentPage />
        </Route>
        <Route to={SUB_ROUTES.VIEW}>
          <BrowseComponentPage />
        </Route>
      </Switch>
    </div>
  )
}
