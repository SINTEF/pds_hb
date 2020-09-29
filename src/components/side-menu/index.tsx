import React from 'react'
import styles from './sideMenu.module.css'
import { MenuButton } from '../menu-button'

export interface SideMenuProps {
  menu: Array<string>

  alert?: number
}

export const SideMenu: React.FC<SideMenuProps> = ({
  menu,
  alert,
}: SideMenuProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.home}></div>
      {menu.map((btn) =>
        btn === 'Approve new users' ? (
          <MenuButton label={btn} alert={alert} key={btn}></MenuButton>
        ) : (
          <MenuButton label={btn} key={btn}></MenuButton>
        )
      )}
    </div>
  )
}