import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { ChooseComponentPage } from '../choose-component-page'
import { BrowseComponentPage } from '../browse-component-page'
import { SUB_ROUTES } from '../../routes/routes.constants'

export const Browse: React.FC = () => {
  const { path } = useRouteMatch()
  return (
    <div>
      <Switch>
        <Route path={path + SUB_ROUTES.VIEW}>
          <BrowseComponentPage />
        </Route>
        <Route path={[path + SUB_ROUTES.CHOOSE_COMP, path]}>
          <ChooseComponentPage />
        </Route>
      </Switch>
    </div>
  )
}
