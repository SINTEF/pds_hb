import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch from 'use-http'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { TextBox } from '../../components/text-box'
import { EditableField } from '../../components/editable-field'
import { Filter } from '../../components/filter'
import { Table } from '../../components/table'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { IComponent } from '../../models/component'
import { IDataInstance } from '../../models/datainstance'
import { APIResponse } from '../../models/api-response'
import { Button } from '../../components/button'

export const BrowseComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()

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
  const headers = [
    'Failure rates',
    'Source',
    'DU',
    'T',
    'Observation start',
    'Observation end',
    'Population size',
    'Comment',
  ]
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
      const dataRequest = `/?component=${componentName}${filters}`
      const failureData = await datainstanceGet(dataRequest)
      if (datainstanceResponse.ok) setFailuredata(failureData.data)
    }
    getFailureData()
  }, [componentName, datainstanceGet, datainstanceResponse, filterState])

  const requestToData = (request: IDataInstance[]) => {
    return (request ?? []).map((data) => [
      data.failureRates?.toString(10),
      data.facility,
      data.du?.toString(10),
      data.T?.toString(10),
      data.startPeriod?.toString,
      data.endPeriod?.toString,
      data.populationSize?.toString(10),
      data.comment?.toString,
    ])
  }

  const data = requestToData(failuredataState as IDataInstance[])

  const userContext = useContext(UserContext) as IUserContext

  const getComponent = (name: string) => {
    return components?.filter((comp) => comp.name === name)[0]
  }

  return componentLoad ? (
    <p>loading...</p>
  ) : (
    <div className={styles.container}>
      <div className={styles.path}>
        <Button
          label={'Back to equipmentsgroup'}
          onClick={() => history.push(MAIN_ROUTES.BROWSE)}
        />
      </div>
      <div>
        <div className={styles.content}>
          <div className={[styles.padding, styles.center].join(' ')}>
            <Title title={compState?.name.replace('-', ' ') as string} />
          </div>
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
                  MAIN_ROUTES.BROWSE +
                    SUB_ROUTES.VIEW.replace(
                      ':componentName',
                      newcomp.replace(' ', '-')
                    )
                )
              }}
            />
          </div>
          <div className={styles.description}>
            <TextBox
              title="Description"
              content={compState?.description as string}
              size="small"
            />
          </div>
          <EditableField
            index="Date of revision"
            content={compState?.revisionDate?.toString().substring(0, 10)}
            mode="view"
            isAdmin={userContext?.user?.userGroupType === 'admin'}
          />
          <EditableField
            index="Remarks"
            content={compState?.remarks}
            mode="view"
            isAdmin={userContext?.user?.userGroupType === 'admin'}
          />
          <EditableField
            index="Recommended values for calculation"
            content={compState?.name} //reccomended vslues not in db
            mode="view"
            isAdmin={userContext?.user?.userGroupType === 'admin'}
          />
          <div className={styles.padding}>
            <TextBox
              title="Definition of DU"
              content={compState?.name as string} // definition of DU not in db
              size="large"
            />
          </div>
          <div className={[styles.center, styles.padding].join(' ')}>
            <Title title="Failure data" />
          </div>
          {datainstanceLoad ? (
            <p>loading...</p>
          ) : (
            <div>
              <div className={[styles.filters, styles.padding].join(' ')}>
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
                <Table
                  headers={headers}
                  data={data}
                  onValueChanged={() => false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
