import React from 'react'
import styles from './Table.module.css'

export interface TableProps {
  onValueChanged: (value: string) => void

  data: (string | undefined)[][]

  headers: Array<string>
}

export const Table: React.FC<TableProps> = ({ data, headers }: TableProps) => {
  const tableRows = data.map((dataCategory, dataIndex) => (
    <tr key={dataIndex}>
      {dataCategory.map((dataInstance, index) => {
        return <td key={index}>{dataInstance}</td>
      })}
    </tr>
  ))
  return (
    <>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {headers.map((header, index) => {
              return <th key={index}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((dataCategory, dataIndex) => {
            return (
              <tr key={dataIndex}>
                {dataCategory.map((dataInstance, index) => {
                  return <td key={index}>{dataInstance}</td>
                })}
              </tr>
            )
          })}
          {
            //tableRows
          }
        </tbody>
      </table>
      {tableRows.length === 0 && (
        <div>{'Nothing matched the chosen filters'}</div>
      )}
    </>
  )
}
