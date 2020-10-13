import React, { useContext } from 'react'

import styles from './header.module.css'
import { DropDownMenu } from '../drop-down-menu'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { Link, useRouteMatch } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

export const Header: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const showHomeLink = !useRouteMatch({
    path: [MAIN_ROUTES.LOGIN, MAIN_ROUTES.HOME],
    exact: true,
  })
  const showUserMenu = !useRouteMatch(MAIN_ROUTES.LOGIN)
  return (
    <div className={styles.container}>
      {showHomeLink ? (
        <Link className={styles.home} to={MAIN_ROUTES.HOME}>
          PDS Datahandbook
        </Link>
      ) : null}
      {showUserMenu ? (
        <div className={styles.dropdown}>
          <DropDownMenu
            username={userContext.user?.username || ''}
            company={userContext.user?.companyName}
          ></DropDownMenu>
        </div>
      ) : null}
    </div>
  )
}
