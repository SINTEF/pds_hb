import React, { useContext, useEffect, useState } from 'react'

import styles from './RegisteredData.module.css'
import { useHistory } from 'react-router-dom'
import { Filter } from '../../components/filter'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch from 'use-http'
import { APIResponse } from '../../models/api-response'
import { IComponent } from '../../models/component'
import { IDataInstance } from '../../models/datainstance'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import MAIN_ROUTES from '../../routes/routes.constants'

export interface Data {
  period: string | number
  t: string | number
  tags: string | number
  du: string | number
  edited: string | number
}

export interface Form {
  filters: { filter: string; value: string }[]
}

export const RegisteredData: React.FC = () => {
  const history = useHistory()
  const userContext = useContext(UserContext) as IUserContext
  const [compState, setComp] = useState<string>()
  const [components, setComponents] = useState<Array<string>>([])
  const [datainstances, setDatainstances] = useState<IDataInstance[]>()
  const [filterState, setFilter] = useState<{ [id: string]: Array<string> }>({})
  const [L3Filters, setL3Filter] = useState<{ [id: string]: string }>()

  const { get: componentGet } = useFetch<APIResponse<IComponent>>('/components')

  const { get: datainstanceGet, response: datainstanceResponse } = useFetch(
    '/data-instances/?company=' + userContext.user?.companyName
  )

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    const initialData = await datainstanceGet()
    if (datainstanceResponse.ok) setDatainstances(initialData.data)
    const components: string[] = []
    initialData.data.forEach((element: IDataInstance) => {
      if (!components.includes(element['component'])) {
        components.push(element['component'])
      }
    })
    setComponents(components)
  }

  const updateFilter = async (newComp: string) => {
    setL3Filter(undefined)
    const component = await componentGet(newComp)
    if (datainstanceResponse.ok) {
      setFilter(component.data.L3)
    }
    setComp(newComp)
  }
  const updateL3Filter = (key: string, newComp: string) => {
    setL3Filter((L3Filters) => ({ ...L3Filters, [key]: newComp }))
  }
  const L3 = (data: { [id: string]: string | undefined }): boolean => {
    if (!L3Filters) return true
    if (!data) return false
    let isTrue = true
    Object.keys(L3Filters).forEach((key) => {
      if (!(key in data && data[key] === L3Filters[key])) {
        isTrue = false
      }
    })
    return isTrue
  }

  return (
    <div>
      <div className={[styles.filters, styles.padding].join(' ')}>
        <Filter
          category="Component" // think i need a isChecked var to set/unset the filter
          filters={components as string[]}
          onClick={(newcomp) => updateFilter(newcomp)}
        />
        {Object.keys(filterState).map((key, index) => (
          <Filter
            key={index}
            category={key}
            filters={filterState[key]}
            onClick={(newcomp) => updateL3Filter(key, newcomp)}
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
                  <td>{'T'}</td>
                  <td>{'PopulationSize'}</td>
                  <td>{'DU'}</td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
          </div>
          {datainstances?.map((data, key) =>
            (data.component === compState || !compState) && L3(data.L3) ? (
              <RegisteredDataField key={key}>
                <label>{data.component}</label>
                <label>{data.T}</label>
                <label>{data.populationSize}</label>
                <label>{data.du}</label>
                <i
                  onClick={() => history.push(MAIN_ROUTES.ADD)}
                  className={'material-icons ' + styles.icon}
                >
                  {'editor'}
                </i>
              </RegisteredDataField>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
