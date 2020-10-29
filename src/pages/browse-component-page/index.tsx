import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch from 'use-http'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { TextBox } from '../../components/text-box'
import { EditableField, FieldForm } from '../../components/editable-field'
import { Filter } from '../../components/filter'
import { Table } from '../../components/table'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { IComponent } from '../../models/component'
import { IDataInstance } from '../../models/datainstance'
import { APIResponse } from '../../models/api-response'
import { stringify } from 'querystring'

export interface Form {
  filters: { filter: string; value: string }[]
}

export const BrowseComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()

  const [compState, setComp] = useState<IComponent>()
  const [components, setComponents] = useState<IComponent[]>([])
  const [failuredataState, setFailuredata] = useState<IDataInstance[]>()
  const [filterState, setFilter] = useState<Form>()
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

  const {
    put: updateData,
    response: updateDataResponse,
    error: updateDataError,
  } = useFetch(`/components`)

  useEffect(() => {
    loadComponents()
  }, [])

  useEffect(() => {
    getFailureData()
  }, [filterState])

  const loadComponents = async () => {
    const initialComp = await componentGet('/?name=' + componentName)
    if (componentResponse.ok) {
      setComp(initialComp.data[0])
      setFilter({
        filters: [{ filter: 'component', value: initialComp.data[0].name }],
      })
    }
    const components = await componentGet()
    if (componentResponse.ok) setComponents(components.data)
  }

  const getFailureData = async () => {
    const dataRequestArray = filterState?.filters.map(
      (filter) => filter.filter + '=' + filter.value
    )
    const dataRequest = '/?' + dataRequestArray?.join('&')
    const failureData = await datainstanceGet(dataRequest)
    if (datainstanceResponse.ok) setFailuredata(failureData.data)
  }

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
    return components?.filter((comp) => (comp.name = name))[0]
  }

  const handleUpdate = (form: FieldForm) => {
    const data: { [id: string]: string } = {}
    data[form.index.toLowerCase()] = form.content
    updateData(compState?.name, data)
  }

  //const getFailureData = () => {
  //  return datainstances?.filter((data) =>
  //    filterState?.filters.forEach((filter, idx) => Object.keys(data.L3)[filter.filter] ? filter.value : )
  //  )
  //}

  const calculateAverageFailureRates = (data: Array<IDataInstance>) => {
    const DuValues = data.map((failureData) => failureData.du) ?? [1, 2, 3]
    const TValues = data.map((failuredata) => failuredata.T) ?? [1, 2, 3]
    let totalDu = 0
    DuValues.forEach((value) => (totalDu += value))
    let totalT = 1
    TValues.forEach((value) => (totalT += value))
    return totalDu / (totalT - 1)
  }

  const LDU = calculateAverageFailureRates(failuredataState ?? [])

  const lambdaDU = LDU.toPrecision(2).toString()

  return componentLoad ? (
    <p>loading...</p>
  ) : (
    <div className={styles.container}>
      <div className={styles.path}>
        <div
          className={styles.back}
          onClick={() => history.push(MAIN_ROUTES.BROWSE)}
        >
          {'< Back'}
        </div>
      </div>
      <div>
        <div className={styles.content}>
          <div className={[styles.padding, styles.center].join(' ')}>
            <Title title={compState?.name.replace('-', ' ') as string} />
          </div>
          <div className={[styles.filters, styles.padding].join(' ')}></div>
          <div className={styles.description}>
            <TextBox
              title="Description"
              content={compState?.description as string}
              size="large"
            />
          </div>
          <EditableField
            index="Date of revision"
            content={compState?.revisionDate?.toString().substring(0, 10)}
            mode="view"
            isAdmin={userContext?.user?.userGroupType === 'admin'}
            onSubmit={handleUpdate}
          />
          <EditableField
            index="Remarks"
            content={compState?.remarks}
            mode="view"
            isAdmin={userContext?.user?.userGroupType === 'admin'}
            onSubmit={handleUpdate}
          />

          <div className={styles.DUcontainer}>
            <div className={styles.lambdaDU}>{'Lambda DU: '}</div>
            <div className={styles.lambdaDUnumber}>{lambdaDU}</div>
          </div>
          {updateDataResponse.ok ? (
            <p className={styles.responseOk}>
              {updateDataResponse.data?.message}
            </p>
          ) : null}
          {updateDataError ? (
            <p className={styles.responseError}>
              {updateDataResponse.data?.message}
            </p>
          ) : null}
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
                {Object.entries(compState?.L3 ?? {})
                  .filter(([, filters]) => filters !== undefined)
                  .map(([filterName, filters]) => (
                    <Filter
                      category={filterName}
                      filters={filters as string[]}
                      onClick={(selected) => {
                        if (filterState) {
                          setFilter({
                            filters: [
                              ...filterState.filters,
                              {
                                filter: filterName,
                                value: selected,
                              },
                            ],
                          })
                          getFailureData()
                        } else {
                          setFilter({
                            filters: [{ filter: filterName, value: selected }],
                          })
                          getFailureData()
                        }
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
