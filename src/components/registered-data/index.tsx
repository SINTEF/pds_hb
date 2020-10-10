import React, { useState } from 'react'

import styles from './RegisteredData.module.css'

import { Filter } from '../filter'
import { RegisteredDataField } from '../registered-data-field'

export interface RegisteredDataProps {
  component: string //this comes from the parentpage in somehow or from userinput by homepage-search
  equipmentgroup: string // this should also come from above
  getComponents: (equipmentGroup: string) => Array<string>
  getFilters: (component: string) => Array<string>
  getValuesForFilter: (filter: string) => Array<string>
  getFailureData: (
    component: string,
    filters: Array<Record<string, string>>
  ) => Array<Array<string>>
  redirect: () => void
  getUser: () => string
  onClick: () => void
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
  onClick,
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
          {getFailureData(compState).map((data) => (
            <RegisteredDataField key={data._id}>
              <label>{component}</label>
              <label>{data.period}</label>
              <label>{data.t}</label>
              <label>{data.tags}</label>
              <label>{data.du}</label>
              <label>{data.edited}</label>
              <i
                onClick={onClick}
                id={data._id}
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
