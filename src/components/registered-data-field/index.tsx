import React from 'react'

import styles from './RegisteredDataField.module.css'

export interface RegisteredDataFieldProps {
  component: string

  period: string

  t: number

  tags: number

  du: number

  edited: string

  icon?: string

  onClick: () => void
}

/**
 * Primary UI component for user interaction
 */
export const RegisteredDataField: React.FC<RegisteredDataFieldProps> = ({
  component,
  period,
  t,
  tags,
  du,
  edited,
  icon = 'editor',
  onClick,
}: RegisteredDataFieldProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{component}</label>
      <label className={styles.label}>{period}</label>
      <label className={styles.label}>{t}</label>
      <label className={styles.label}>{tags}</label>
      <label className={styles.label}>{du}</label>
      <label className={styles.label}>{edited}</label>
      <i
        className={['material-icons', styles.icon].join(' ')}
        onClick={onClick}
      >
        {icon}
      </i>
    </div>
  )
}
