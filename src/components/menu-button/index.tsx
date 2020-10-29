import React from 'react'
import styles from './MenuButton.module.css'

export interface MenuButtonProps {
  type?: 'standard' | 'logout'

  label: string

  alert?: number

  onClick?: () => void
}

/*
Standard menubutton for both user drop down menu
and account/company menu
*/
export const MenuButton: React.FC<MenuButtonProps> = ({
  type = 'standard',
  label,
  alert,
  onClick,
}: MenuButtonProps) => {
  return (
    <div className={styles.container}>
      <hr className={styles.line} />
      <button
        className={[
          styles.button,
          styles[type],
          alert ? styles.notify : '',
        ].join(' ')}
        onClick={onClick}
      >
        {label}
        {alert && <div className={styles.notifysignal}>{alert}</div>}
      </button>
    </div>
  )
}
