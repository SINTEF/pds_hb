import React, { forwardRef } from 'react'
import styles from './sideMenu.module.css'

export interface SideMenuProps {
  children: JSX.Element | JSX.Element[]
}

const SideMenu: React.FC<SideMenuProps> = ({ children }: SideMenuProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.home}></div>
      {children}
    </div>
  )
}

const RefSideMenu = forwardRef<HTMLDivElement, SideMenuProps>(
  ({ children }: SideMenuProps, ref) => {
    return (
      <div ref={ref} className={styles.container}>
        <div className={styles.home}></div>
        {children}
      </div>
    )
  }
)

RefSideMenu.displayName = 'RefSideMenu'

export { SideMenu, RefSideMenu }
