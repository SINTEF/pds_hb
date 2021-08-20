import React from 'react'
import styles from './Switch.module.css'

export interface SwitchProps {
  checked: boolean

  disabled: boolean

  handleChange: () => void

  size?: 'small' | 'medium' | 'large'

  color?: 'blue' | 'red' | 'green'
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  disabled,
  handleChange,
  size = 'medium',
  color = 'blue',
}: SwitchProps) => {
  return (
    <label className={[styles.switch, styles[size]].join(' ')}>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
        className={styles[color]}
      ></input>
      <span className={[styles.slider, styles.round].join(' ')}> </span>
    </label>
  )
}
