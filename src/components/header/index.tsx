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
  const showUserMenu = !useRouteMatch({
    path: [MAIN_ROUTES.LOGIN, MAIN_ROUTES.REGISTER],
    exact: true,
  })

  const showTopMenu = !useRouteMatch({
    path: [MAIN_ROUTES.LOGIN, MAIN_ROUTES.REGISTER, MAIN_ROUTES.HOME],
    exact: true,
  })

  const url = window.location.pathname

  return (
    <div className={styles.container}>
      {showHomeLink ? (
        <Link className={styles.home} to={MAIN_ROUTES.HOME}>
          PDS Datahandbook
        </Link>
      ) : null}
      {showTopMenu ? (
        <div className={styles.pageLinks}>
          <Link
            className={
              url === MAIN_ROUTES.READ ? styles.current : styles.pageLink
            }
            to={MAIN_ROUTES.READ}
          >
            {' '}
            Read
          </Link>
          <Link
            className={
              url === MAIN_ROUTES.BROWSE ? styles.current : styles.pageLink
            }
            to={MAIN_ROUTES.BROWSE}
          >
            {' '}
            Browse
          </Link>
          {userContext.user?.userGroupType === 'operator' ? (
            <div className={styles.operatorLinks}>
              <Link
                className={
                  url === MAIN_ROUTES.NOTIFICATIONS
                    ? styles.current
                    : styles.pageLink
                }
                to={MAIN_ROUTES.NOTIFICATIONS}
              >
                {' '}
                Notifications
              </Link>
              <Link
                className={
                  url === MAIN_ROUTES.INVENTORY
                    ? styles.current
                    : styles.pageLink
                }
                to={MAIN_ROUTES.INVENTORY}
              >
                {' '}
                Inventory
              </Link>
              <Link
                className={
                  url === MAIN_ROUTES.ANALYSIS
                    ? styles.current
                    : styles.pageLink
                }
                to={MAIN_ROUTES.ANALYSIS}
              >
                {' '}
                Analysis
              </Link>
            </div>
          ) : null}
        </div>
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
