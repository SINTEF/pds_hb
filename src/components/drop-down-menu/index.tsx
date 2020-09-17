import React from 'react'
import Ripples from 'react-ripples'

import styles from './DropDownMenu.module.css'
import { background } from '@storybook/theming'

export interface DropDownMenuProps {
  username?: string

  company?: string | null
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  ...props
}: DropDownMenuProps) => {
  return (
    <div className={styles.DropDownMenu}>
      <h1 className={styles.username}>{props.username}</h1>
      <h2 className={styles.company}>{props.company}</h2>
    </div>
  )
}
