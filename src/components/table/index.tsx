import React from 'react'
import styles from './Table.module.css'

export interface TableProps {
  onValueChanged: (value: string) => void

  data: (string | (() => string) | undefined)[][]

  headers: Array<string>
}

export const Table: React.FC<TableProps> = ({ data, headers }: TableProps) => {
  return (
    <table className={styles.dataTable}>
      <tr>
        {headers.map((header, index) => {
          return <th key={index}>{header}</th>
        })}
      </tr>
      {data.map((dataCategory, dataIndex) => {
        return (
          <tr key={dataIndex}>
            {dataCategory.map((dataInstance, index) => {
              return <td key={index}>{dataInstance}</td>
            })}
          </tr>
        )
      })}
    </table>
  )
}
