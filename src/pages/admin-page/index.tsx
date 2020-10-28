import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { MenuButton } from '../../components/menu-button'

import { SideMenu } from '../../components/side-menu'
import { ADMIN_SUB_ROUTES } from '../../routes/routes.constants'
import { AddCompanyPage } from '../admin-add-company'

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
                onClick={() => history.push(url + ADMIN_SUB_ROUTES.USER)}
                label="Admin user"
              />
              <MenuButton
                onClick={() =>
                  history.push(url + ADMIN_SUB_ROUTES.SEE_ALL_EDITS)
                }
                label="See all edits"
              />
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
          <Route path={path + ADMIN_SUB_ROUTES.SEE_ALL_EDITS}>
            {/*we dont have a page for this yet*/}
          </Route>
          <Route path={path + ADMIN_SUB_ROUTES.APPROVE_USERS}>
            {/*we dont have a page for this yet*/}
          </Route>
          <Route path={path + ADMIN_SUB_ROUTES.ADD_COMPANY}>
            <AddCompanyPage />
          </Route>
          <Route path={[path + ADMIN_SUB_ROUTES.USER, path]}>
            {/*we dont have a user page yet*/}
            {'this will be the user page'}
          </Route>
        </Switch>
      </div>
    </div>
  )
}
