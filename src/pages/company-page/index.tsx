import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { MenuButton } from '../../components/menu-button'

import { SideMenu } from '../../components/side-menu'
import { COMPANY_SUB_ROUTES, SUB_ROUTES } from '../../routes/routes.constants'
import { CompanyUserPage } from '../company-user-page'
import { ManageFacilitiesPage } from '../manage-facilities-page'
import { ManageStaffmembersPage } from '../manage-staffmembers-page'
import { RegisteredDataPage } from '../registered-data'
import { UpdateDataPage } from '../update-data-page'

import styles from './CompanyPage.module.css'

// TO FIX: Needs styling for menu
export const CompanyPage: React.FC = () => {
  const { url, path } = useRouteMatch()
  const history = useHistory()
  return (
    <div className={styles.page}>
      <div className={styles.menuWrapper}>
        <div className={styles.menu}>
          <SideMenu>
            <>
              <MenuButton
                onClick={() => history.push(url + COMPANY_SUB_ROUTES.REG_DATA)}
                label="Browse own equipment data"
              />
              <MenuButton
                onClick={() => history.push(url + COMPANY_SUB_ROUTES.USER)}
                label="Company user"
              />
              <MenuButton
                onClick={() =>
                  history.push(url + COMPANY_SUB_ROUTES.MANAGE_STAFF)
                }
                label="Manage staffmembers"
              />
              <MenuButton
                onClick={() =>
                  history.push(url + COMPANY_SUB_ROUTES.MANAGE_FAC)
                }
                label="Manage facilities"
              />
            </>
          </SideMenu>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Route
            exact
            path={
              path +
              COMPANY_SUB_ROUTES.REG_DATA +
              SUB_ROUTES.VIEW +
              SUB_ROUTES.UPDATE
            }
          >
            <UpdateDataPage />
          </Route>
          <Route
            exact
            path={[
              path + COMPANY_SUB_ROUTES.REG_DATA + SUB_ROUTES.VIEW,
              path + SUB_ROUTES.VIEW,
            ]}
          >
            <RegisteredDataPage />
          </Route>
          <Route path={path + COMPANY_SUB_ROUTES.MANAGE_FAC}>
            <ManageFacilitiesPage />
          </Route>
          <Route path={path + COMPANY_SUB_ROUTES.MANAGE_STAFF}>
            <ManageStaffmembersPage />
          </Route>
          <Route path={path + COMPANY_SUB_ROUTES.USER}>
            <CompanyUserPage />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
