import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch from 'use-http'
import MAIN_ROUTES, {
  COMPANY_SUB_ROUTES,
  SUB_ROUTES,
} from '../../routes/routes.constants'

import styles from './RegisteredDataPage.module.css'

import { Title } from '../../components/title'
import { Filter } from '../../components/filter'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { IComponent } from '../../models/component'
import { IDataInstance } from '../../models/datainstance'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'

export const RegisteredDataPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()
  const userContext = useContext(UserContext) as IUserContext
  const [compState, setComp] = useState<IComponent>()
  const [components, setComponents] = useState<IComponent[]>([])
  const [failuredataState, setFailuredata] = useState<IDataInstance[]>([])
  const [filterState, setFilter] = useState<
    Record<string, Record<string, boolean>>
  >({})
  const equipmentGroup = compState?.equipmentGroup
  const componentNames = components
    .filter((component) => component.equipmentGroup === equipmentGroup)
    .map((component) => component.name.replace('-', ' '))
  const history = useHistory()

  // {name: string, size: string, design: string, revisionDate: string, remarks: string,
  // description: string, updated: string, data: {}, module:  string, equipmentGroup: string,
  // filters: {måleprinsipp: [guge, beta, alfa], medium: [fejiugo, fsf ] }}
  // size and design is filters?
  const {
    get: componentGet,
    response: componentResponse,
    loading: componentLoad,
  } = useFetch<APIResponse<IComponent>>('/components')

  const {
    get: datainstanceGet,
    response: datainstanceResponse,
    loading: datainstanceLoad,
  } = useFetch<APIResponse<IDataInstance>>('/data-instances')

  useEffect(() => {
    const loadComponents = async () => {
      const initialComp: APIResponse<IComponent[]> = await componentGet(
        '/?name=' + componentName
      )
      if (componentResponse.ok) {
        setComp(initialComp.data[0])
        setFilter(
          Object.entries(initialComp.data[0].L3).reduce(
            (object, [key, value]) => ({
              ...object,
              [key]: value?.reduce(
                (object, filterValue) => ({ ...object, [filterValue]: false }),
                {}
              ),
            }),
            {}
          )
        )
      }
      const components = await componentGet()
      if (componentResponse.ok) setComponents(components.data)
    }
    loadComponents()
  }, [componentGet, componentName, componentResponse])

  useEffect(() => {
    const getFailureData = async () => {
      const dataRequestArray: string[] = Object.keys(filterState).flatMap(
        (filter) =>
          Object.entries(filterState[filter])
            .filter(([, value]) => value)
            .map(([name]) => `L3.${filter}=${name}`)
      )
      const filters =
        dataRequestArray.length > 0 ? '&' + dataRequestArray.join('&') : ''
      const dataRequest = `/?component=${componentName}${filters}&company=${userContext.user?.companyName}`
      const failureData = await datainstanceGet(dataRequest)
      if (datainstanceResponse.ok) setFailuredata(failureData.data)
    }
    getFailureData()
  }, [componentName, datainstanceGet, datainstanceResponse, filterState])

  const getComponent = (name: string) => {
    return components?.filter((comp) => comp.name === name)[0]
  }

  return componentLoad ? (
    <p>loading...</p>
  ) : (
    <div className={styles.container}>
      <label
        className={styles.button}
        onClick={() =>
          history.push(MAIN_ROUTES.COMPANY + COMPANY_SUB_ROUTES.REG_DATA)
        }
      >
        {' < Back'}
      </label>
      <div className={styles.center}>
        <Title title={compState?.name.replace('-', ' ') as string} />
      </div>
      {datainstanceLoad ? (
        <p>loading...</p>
      ) : (
        <div>
          <div className={[styles.filters, styles.padding].join(' ')}>
            <Filter
              category="Component" // think i need a isChecked var to set/unset the filter
              filters={componentNames.reduce(
                (obj, name) => ({ ...obj, [name]: false }),
                {}
              )}
              onClick={(newcomp) => {
                setComp(getComponent(newcomp))
                history.push(
                  MAIN_ROUTES.COMPANY +
                    COMPANY_SUB_ROUTES.REG_DATA +
                    SUB_ROUTES.VIEW.replace(
                      ':componentName',
                      newcomp.replace(' ', '-')
                    )
                )
              }}
            />
            {Object.entries(filterState).map(([filterName, filters]) => (
              <Filter
                category={filterName}
                filters={filters}
                onClick={(selected, newValue) => {
                  setFilter({
                    ...filterState,
                    [filterName]: {
                      ...filterState[filterName],
                      [selected]: newValue,
                    },
                  })
                }}
                key={filterName}
              />
            ))}
          </div>
          <div className={styles.table}>
            <div>
              <table className={styles.headers}>
                <tbody>
                  <tr>
                    <td>{'Component'}</td>
                    <td>{'T'}</td>
                    <td>{'PopulationSize'}</td>
                    <td>{'DU'}</td>
                    <td> {'Comment'}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            {failuredataState?.map((data, key) => (
              <RegisteredDataField key={key}>
                <label>{data.component}</label>
                <label>{data.T}</label>
                <label>{data.populationSize}</label>
                <label>{data.du}</label>
                <label>{data.comment}</label>
                <i
                  onClick={() => history.push(MAIN_ROUTES.ADD)}
                  className={'material-icons ' + styles.icon}
                >
                  {'editor'}
                </i>
              </RegisteredDataField>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
