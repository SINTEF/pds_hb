import React from 'react'
import styles from './FilterButton.module.css'

export interface FilterButtonProps {
  label: string

  icon: string

  icon2: string

  open: boolean

  onClick: () => void
}
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  icon = 'expand_more',
  icon2 = 'expand_less',
  onClick,
  open,
}: FilterButtonProps) => {
  return (
    <div className={styles.container}>
      <button
        className={[styles.button, styles.standard].join(' ')}
        onClick={onClick}
      >
        <div>{label}</div>
        {open ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : (
          <i className={'material-icons ' + styles.icon}>{icon2}</i>
        )}
      </button>
    </div>
  )
}
