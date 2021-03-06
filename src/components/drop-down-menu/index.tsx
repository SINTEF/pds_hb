import React, { useContext, useRef } from 'react'

import { MenuButton } from '../menu-button'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useLocalStorage from '../../utils/hooks/useLocalStorage'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import MAIN_ROUTES from '../../routes/routes.constants'

import styles from './DropDownMenu.module.css'
import { useClickOutside } from '../../utils/hooks/useClickOutside'

export interface DropDownMenuProps {
  username: string

  company?: string
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  username,
  company,
}: DropDownMenuProps) => {
  const [isClicked, setMode] = useState<boolean>(false)
  const history = useHistory()

  const { setValue } = useLocalStorage('token', '')
  const userContext = useContext(UserContext) as IUserContext

  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, () => setMode(false))

  const logout: () => void = () => {
    setValue('')
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
      {isClicked && userContext.user?.userGroupType === 'general_user' && (
        <div className={styles.dropDownMenu} ref={menuRef}>
          <MenuButton
            label={'My account'}
            onClick={() => navigateTo(MAIN_ROUTES.ACCOUNT)}
          ></MenuButton>
          <MenuButton
            type={'logout'}
            label={'Log out'}
            onClick={logout}
          ></MenuButton>
        </div>
      )}
      {isClicked && userContext.user?.userGroupType === 'operator' && (
        <div className={styles.dropDownMenu} ref={menuRef}>
          <MenuButton
            label={'My account'}
            onClick={() => navigateTo(MAIN_ROUTES.ACCOUNT)}
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
      {isClicked && userContext.user?.userGroupType === 'admin' && (
        <div className={styles.dropDownMenu} ref={menuRef}>
          <MenuButton
            label={'My account'}
            onClick={() => navigateTo(MAIN_ROUTES.ACCOUNT)}
          ></MenuButton>
          <MenuButton
            label={'Company page'}
            onClick={() => navigateTo(MAIN_ROUTES.ADMIN_COMPANY)}
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
