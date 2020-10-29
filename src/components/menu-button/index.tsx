import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { APIResponse } from '../../models/api-response'
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
    if (staffResponse.ok) setUsers(users.data ?? [])
  }

  const getNewGeneralUsers = () => {
    const newUsers = usersState.filter(
      (user) => user.userGroupType === 'none' && user.companyName === 'none'
    )
    if (newUsers?.length > 0) {
      return newUsers?.length
    }
    return 0
  }
  return (
    <div className={styles.container}>
      <hr className={styles.line} />
      <button
        className={[
          styles.button,
          styles[type],
          (getNewGeneralUsers() || 0) > 0 ? styles.notify : '',
        ].join(' ')}
        onClick={onClick}
      >
        {label}
        {getNewGeneralUsers() && (
          <div className={styles.notifysignal}>{getNewGeneralUsers()}</div>
        )}
      </button>
    </div>
  )
}
