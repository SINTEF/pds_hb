import React from 'react'
import styles from './MenuButton.module.css'

export interface MenuButtonProps {
  type: 'standard' | 'logout' | 'notify'

  label: string

  alert?: Int16Array

  onClick: () => void
}

/*
Standard menubutton for both user drop down menu
and account/company menu
*/
export const MenuButton: React.FC<MenuButtonProps> = ({
  type = 'standard',
  label,
  alert,
}: MenuButtonProps) => {
  return (
    <div className={styles.container}>
      <hr className={styles.line} />
      <button className={[styles.button, styles[type]].join(' ')}>
        {label}
        {type == 'notify' && <div className={styles.notifysignal}>{alert}</div>}
      </button>
    </div>
  )
}
