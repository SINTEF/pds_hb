import React from 'react'
import styles from './Switch.module.css'

export interface SwitchProps {
  checked: boolean

  disabled: boolean

  handleChange: () => void

  size?: 'small' | 'medium' | 'large'
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  disabled,
  handleChange,
  size = 'medium',
}: SwitchProps) => {
  return (
    <label className={[styles.switch, styles[size]].join(' ')}>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
      ></input>
      <span className={[styles.slider, styles.round].join(' ')}> </span>
    </label>
  )
}
