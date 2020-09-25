import React from 'react'
import styles from './Switch.module.css'

export interface SwitchProps {
  checked: boolean

  diasabled: boolean

  handleChange: () => void

  size?: small | medium | large
}

export const Switch: React.FC<Switch> = ({
  checked,
  diasabled,
  handleChange,
  size = 'medium',
}: SwitchProps) => {
  return (
    <label className={[styles.switch, styles[size]].join(' ')}>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        diasabled={diasabled}
      ></input>
      <span className={[styles.slider, styles.round].join(' ')}> </span>
    </label>
  )
}
