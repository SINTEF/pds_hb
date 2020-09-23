import React from 'react'

import styles from './header.module.css'
import { DropDownMenu } from '../drop-down-menu'

export interface HeaderProps {
  isCompanyUser: boolean

  username: string

  company?: string

  onClick: () => void
}

export const Header: React.FC<HeaderProps> = ({
  isCompanyUser,
  username,
  company,
  onClick,
}: HeaderProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.home} onClick={onClick}>
        {'PDS Datahandbook'}
      </div>
      <DropDownMenu
        isCompanyUser={isCompanyUser}
        username={username}
        company={company}
      ></DropDownMenu>
    </div>
  )
}
