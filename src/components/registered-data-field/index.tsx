import React from 'react'

import styles from './RegisteredDataField.module.css'

export interface RegisteredDataFieldProps {
  children: JSX.Element[]
}

export const RegisteredDataField: React.FC<RegisteredDataFieldProps> = ({
  children,
}: RegisteredDataFieldProps) => {
  return (
    <table className={styles.container}>
      <tbody>
        <tr>
          {children.map((d, key) => (
            <td key={key}>{d}</td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}
