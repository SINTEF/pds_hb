import React, { useContext } from 'react'

import { MenuButton } from '../menu-button'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useLocalStorage from '@rooks/use-localstorage'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import MAIN_ROUTES from '../../routes/routes.constants'

import styles from './DropDownMenu.module.css'

export interface DropDownMenuProps {
  isCompanyUser: boolean

  username: string

  company?: string
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  username,
  company,
}: DropDownMenuProps) => {
  const [isClicked, setMode] = useState<boolean>(false)
  const history = useHistory()

  const [set] = useLocalStorage('token', '')
  const userContext = useContext(UserContext) as IUserContext

  const logout: () => void = () => {
    set('')
    userContext.setUser(undefined)
    setMode(false)
    history.push(MAIN_ROUTES.LOGIN)
  }

  const navigateTo: (path: string) => void = (path) => {
    history.push(path)
    setMode(false)
  }

  return (
    <div>
      <div
        className={[styles.title, isClicked ? '' : styles.notClicked].join(' ')}
      >
        {isClicked && (
          <div>
            <div className={styles.username}>{username}</div>
            <div className={styles.company}>{company}</div>
          </div>
        )}
        <div className={styles.usersymbol} onClick={() => setMode(!isClicked)}>
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
      {isClicked && (
        <div className={styles.dropDownMenu}>
          <MenuButton
            label={'My account'}
            onClick={() => navigateTo(MAIN_ROUTES.COMPANY)}
          ></MenuButton>
          <MenuButton
            label={'Company page'}
            onClick={() => navigateTo(MAIN_ROUTES.COMPANY)}
          ></MenuButton>
          <MenuButton
            type={'logout'}
            label={'Log out'}
            onClick={logout}
          ></MenuButton>
        </div>
      )}
    </div>
  )
}
