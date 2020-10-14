import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { MenuButton } from '../../components/menu-button'

import { SideMenu } from '../../components/side-menu'
import { COMPANY_SUB_ROUTES } from '../../routes/routes.constants'
import { CompanyUserPage } from '../company-user-page'
import { ManageFacilitiesPage } from '../manage-facilities-page'
import { ManageStaffmembersPage } from '../manage-staffmembers-page'

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
                label="Registered data"
              />
              <MenuButton
                onClick={() => history.push(url + COMPANY_SUB_ROUTES.USER)}
                label="User page"
              />
              <MenuButton
                onClick={() =>
                  history.push(url + COMPANY_SUB_ROUTES.MANAGE_FAC)
                }
                label="Manage Facilities"
              />
              <MenuButton
                onClick={() =>
                  history.push(url + COMPANY_SUB_ROUTES.MANAGE_STAFF)
                }
                label="Manage staff"
              />
            </>
          </SideMenu>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Route path={path + COMPANY_SUB_ROUTES.REG_DATA}>
            {/* <RegisteredData />  this component needs some work before it can be used*/}
          </Route>
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
    </div>
  )
}
