import React from 'react'
import Ripples from 'react-ripples'

import styles from './MenuButton.module.css'

export interface MenuButtonProps {
  type?: 'standard' | 'logout' | 'notify'

  label: string

  onClick: () => void
}

/*
Standard menubutton for both user drop down menu
and account/company menu
*/
export const MenuButton: React.FC<MenuButtonProps> = ({
  type = 'standard',
  label,
  ...props
}: MenuButtonProps) => {
  return (
    <div className={styles.container}>
      <hr className={styles.line} />
      <button className={[styles.button, styles[type]].join(' ')}>
        {label}
      </button>
    </div>
  )
}
