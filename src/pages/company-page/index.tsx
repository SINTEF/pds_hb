import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'

import { SideMenu } from '../../components/side-menu'
import { COMPANY_SUB_ROUTES } from '../../routes/routes.constants'
import { CompanyUserPage } from '../company-user-page'
import { ManageFacilitiesPage } from '../manage-facilities-page'
import { ManageStaffmembersPage } from '../manage-staffmembers-page'

export const CompanyPage: React.FC = () => {
  return (
    <>
      <SideMenu>
        <>
          <NavLink to={COMPANY_SUB_ROUTES.REG_DATA} activeClassName="clicked" />
          <NavLink to={COMPANY_SUB_ROUTES.USER} activeClassName="clicked" />
          <NavLink
            to={COMPANY_SUB_ROUTES.MANAGE_FAC}
            activeClassName="clicked"
          />
          <NavLink
            to={COMPANY_SUB_ROUTES.MANAGE_STAFF}
            activeClassName="clicked"
          />
        </>
      </SideMenu>
      <Switch>
        <Route>
          <CompanyUserPage />
        </Route>
        <Route>
          <ManageFacilitiesPage />
        </Route>
        <Route>
          <ManageStaffmembersPage />
        </Route>
      </Switch>
    </>
  )
}
