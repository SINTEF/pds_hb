import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { MenuButton } from '../../components/menu-button'

import { SideMenu } from '../../components/side-menu'
import { ADMIN_SUB_ROUTES, SUB_ROUTES } from '../../routes/routes.constants'
import { AddCompanyPage } from '../admin-add-company'
import { ApproveUsersPage } from '../admin-apporve-users'
import { UpdateDataPage } from '../update-data-page'

import styles from './AdminPage.module.css'

// TO FIX: Needs styling for menu
export const AdminPage: React.FC = () => {
  const { url, path } = useRouteMatch()
  const history = useHistory()
  return (
    <div className={styles.page}>
      <div className={styles.menuWrapper}>
        <div className={styles.menu}>
          <SideMenu>
            <>
              <MenuButton
                onClick={() =>
                  history.push(url + ADMIN_SUB_ROUTES.APPROVE_USERS)
                }
                label="Approve new users" //TODO: add alerts
              />
              <MenuButton
                onClick={() => history.push(url + ADMIN_SUB_ROUTES.ADD_COMPANY)}
                label="Add new company"
              />
            </>
          </SideMenu>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Route
            exact
            path={[
              path + ADMIN_SUB_ROUTES.SEE_ALL_EDITS + SUB_ROUTES.UPDATE,
              path + SUB_ROUTES.UPDATE,
            ]}
          >
            <UpdateDataPage />
          </Route>
          <Route path={path + ADMIN_SUB_ROUTES.APPROVE_USERS}>
            <ApproveUsersPage />
          </Route>
          <Route path={path + ADMIN_SUB_ROUTES.ADD_COMPANY}>
            <AddCompanyPage />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
