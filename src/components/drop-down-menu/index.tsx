import React from 'react'

import styles from './DropDownMenu.module.css'
import { MenuButton } from '../menu-button'
import { useState } from 'react'
import { bool } from 'prop-types'

export interface DropDownMenuProps {
  isCompanyUser: boolean

  isClicked: boolean

  username: string

  company?: string
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  username,
  company,
}: DropDownMenuProps) => {
  const [isClicked, setMode] = useState<boolean>(false)
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
          {username.charAt(0)}
        </div>
      </div>
      {isClicked && (
        <div className={styles.dropDownMenu}>
          <MenuButton label={'My account'}></MenuButton>
          <MenuButton label={'Company page'}></MenuButton>
          <MenuButton type={'logout'} label={'Log out'}></MenuButton>
        </div>
      )}
    </div>
  )
}
