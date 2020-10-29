import React, { useContext, useEffect, useState } from 'react'
import useFetch from 'use-http'
import { APIResponse } from '../../models/api-response'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { IUser } from '../../models/user'
import styles from './MenuButton.module.css'

export interface MenuButtonProps {
  type?: 'standard' | 'logout'

  label: string

  onClick?: () => void
}

/*
Standard menubutton for both user drop down menu
and account/company menu
*/
export const MenuButton: React.FC<MenuButtonProps> = ({
  type = 'standard',
  label,
  onClick,
}: MenuButtonProps) => {
  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName
  const [usersState, setUsers] = useState<IUser[]>([])

  const { get: staffGet, response: staffResponse } = useFetch<
    APIResponse<IUser[]>
  >('/user/users')

  useEffect(() => {
    getUsers()
  }, [])

  // users.data is undefined
  const getUsers = async () => {
    const users = await staffGet()
    if (staffResponse.ok) setUsers(users.data)
  }

  const getNewCompanyUsers = () => {
    const newUsers = usersState.filter(
      (user) =>
        user.userGroupType === 'none' && user.companyName === companyName
    )
    return (newUsers?.length || []) > 0 ? newUsers?.length : null
  }

  const getNewGeneralUsers = () => {
    const newUsers = usersState.filter(
      (user) => user.userGroupType === 'none' && user.companyName === 'none'
    )
    return (newUsers?.length || []) > 0 ? newUsers?.length : null
  }

  if (userContext.user?.userGroupType === 'operator')
    return (
      <div className={styles.container}>
        <hr className={styles.line} />
        <button
          className={[
            styles.button,
            styles[type],
            (getNewCompanyUsers() || []) > 0 ? styles.notify : '',
          ].join(' ')}
          onClick={onClick}
        >
          {label}
          {getNewCompanyUsers() && (
            <div className={styles.notifysignal}>{alert}</div>
          )}
        </button>
      </div>
    )
  if (userContext.user?.userGroupType === 'admin')
    return (
      <div className={styles.container}>
        <hr className={styles.line} />
        <button
          className={[
            styles.button,
            styles[type],
            (getNewGeneralUsers() || []) > 0 ? styles.notify : '',
          ].join(' ')}
          onClick={onClick}
        >
          {label}
          {getNewGeneralUsers() && (
            <div className={styles.notifysignal}>{alert}</div>
          )}
        </button>
      </div>
    )
  else return <div>{'undefined'}</div>
}
