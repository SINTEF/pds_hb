import React from 'react'

import styles from './RegisteredDataField.module.css'

export interface RegisteredDataFieldProps {
  children: JSX.Element[]
}

export const RegisteredDataField: React.FC<RegisteredDataFieldProps> = ({
  children,
}: RegisteredDataFieldProps) => {
  return (
    <div className={styles.container}>
      {children.map((d, key) => (
        <td key={key}>{d}</td>
      ))}
    </div>
  )
}
