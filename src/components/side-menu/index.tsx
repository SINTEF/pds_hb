import React from 'react'
import styles from './sideMenu.module.css'

export interface SideMenuProps {
  children: JSX.Element | JSX.Element[]
}

export const SideMenu: React.FC<SideMenuProps> = ({
  children,
}: SideMenuProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.home}></div>
      {children}
    </div>
  )
}
