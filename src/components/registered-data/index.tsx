import React, { useState } from 'react'

import styles from './RegisteredData.module.css'

import { Filter } from '../filter'
import { RegisteredDataField } from '../registered-data-field'

export interface Data {
  period: string | number
  t: string | number
  tags: string | number
  du: string | number
  edited: string | number
}

export interface RegisteredDataProps {
  component: string //this comes from the parentpage in somehow or from userinput by homepage-search
  equipmentgroup: string // this should also come from above
  getComponents: (equipmentGroup: string) => Array<string>
  getFilters: (component: string) => Array<string>
  getValuesForFilter: (filter: string) => Array<string>
  getFailureData: (
    component: string,
    filters: Array<Record<string, string>>
  ) => Array<{
    period: string | number
    t: string | number
    tags: string | number
    du: string | number
    edited: string | number
  }>
  redirect: () => void
  editData: (arg0: Data) => void
}

export interface Form {
  filters: { filter: string; value: string }[]
}

export const RegisteredData: React.FC<RegisteredDataProps> = ({
  component,
  equipmentgroup,
  getComponents,
  getFilters,
  getValuesForFilter,
  getFailureData,
  redirect,
  editData,
}: RegisteredDataProps) => {
  const [compState, setComp] = useState<string>(component)
  const [filterState, setFilter] = useState<Form>({
    filters: [{ filter: 'Component', value: compState }],
  })

  return (
    <div>
      <div className={styles.path} onClick={redirect}>
        {'/Choose equipmentgroup /'}
        {equipmentgroup}
      </div>
      <div className={[styles.filters, styles.padding].join(' ')}>
        {
          //filters - use getFilters and for each filter return a
          // FilterComponent
          // think i need a isChecked var to set/unset the filter
        }
        <Filter
          category="Component"
          filters={getComponents(equipmentgroup)}
          onClick={(newcomp) => setComp(newcomp)}
        />
        {getFilters(compState).map((filter) => (
          <Filter
            category={filter}
            filters={getValuesForFilter(filter)}
            onClick={(selected) =>
              setFilter({
                filters: [
                  ...filterState.filters,
                  {
                    filter: filter,
                    value: selected,
                  },
                ],
              })
            }
            key={filter}
          />
        ))}
      </div>
      <div>
        <div className={styles.content}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td>{'Component'}</td>
                  <td>{'Period'}</td>
                  <td>{'T'}</td>
                  <td>{'Tags'}</td>
                  <td>{'DU'}</td>
                  <td>{'Edited'}</td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
          </div>
          {getFailureData(compState, filterState.filters).map((data, key) => (
            <RegisteredDataField key={key}>
              <label>{component}</label>
              <label>{data.period}</label>
              <label>{data.t}</label>
              <label>{data.tags}</label>
              <label>{data.du}</label>
              <label>{data.edited}</label>
              <i
                onClick={() => editData(data)}
                className={'material-icons ' + styles.icon}
              >
                {'editor'}
              </i>
            </RegisteredDataField>
          ))}
        </div>
      </div>
    </div>
  )
}
