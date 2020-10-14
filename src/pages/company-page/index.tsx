import React from 'react'
import { Switch, Route, NavLink, useRouteMatch } from 'react-router-dom'

import { SideMenu } from '../../components/side-menu'
import { COMPANY_SUB_ROUTES } from '../../routes/routes.constants'
import { CompanyUserPage } from '../company-user-page'
import { ManageFacilitiesPage } from '../manage-facilities-page'
import { ManageStaffmembersPage } from '../manage-staffmembers-page'

// TO FIX: Needs styling for menu
export const CompanyPage: React.FC = () => {
  const { url, path } = useRouteMatch()
  return (
    <div>
      <SideMenu>
        <>
          <NavLink to={url + COMPANY_SUB_ROUTES.REG_DATA}>
            Register data
          </NavLink>
          <NavLink to={url + COMPANY_SUB_ROUTES.USER}>User</NavLink>
          <NavLink to={url + COMPANY_SUB_ROUTES.MANAGE_FAC}>
            Manage facilities
          </NavLink>
          <NavLink to={url + COMPANY_SUB_ROUTES.MANAGE_STAFF}>
            Manage staff
          </NavLink>
        </>
      </SideMenu>
      <Switch>
        <Route path={path + COMPANY_SUB_ROUTES.USER}>
          <CompanyUserPage />
        </Route>
        <Route path={path + COMPANY_SUB_ROUTES.MANAGE_FAC}>
          <ManageFacilitiesPage />
        </Route>
        <Route path={path + COMPANY_SUB_ROUTES.MANAGE_STAFF}>
          <ManageStaffmembersPage />
        </Route>
      </Switch>
    </div>
  )
}
