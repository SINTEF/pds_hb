import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

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

export const BrowseComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()

  const [compState, setComp] = useState<IComponent>()
  const [failuredataState, setFailuredata] = useState<IDataInstance[]>([])
  const [allDataInstances, setAll] = useState<IDataInstance[]>([])
  const [filterState, setFilter] = useState<
    Record<string, Record<string, boolean>>
  >({})

  const headers = [
    'Failure rates',
    'Company',
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
  } = useFetch<APIResponse<IComponent>>('/components', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const {
    get: datainstanceGet,
    response: datainstanceResponse,
    loading: datainstanceLoad,
  } = useFetch<APIResponse<IDataInstance>>('/data-instances', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const {
    put: updateData,
    response: updateDataResponse,
    error: updateDataError,
  } = useFetch(`/components`)

  useEffect(() => {
    const loadComponents = async () => {
      const initialComp: APIResponse<IComponent[]> = await componentGet(
        '/?name=' + componentName
      )
      if (componentResponse.ok) {
        setComp({
          ...initialComp.data[0],
          revisionDate: new Date(initialComp.data[0].revisionDate as Date),
        })
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
      const dataInstances = await datainstanceGet(
        `/?component=${componentName}&status=published`
      )
      setAll(dataInstances.data)
      const dataRequest = `/?component=${componentName}${filters}&status=published`
      const failureData = await datainstanceGet(dataRequest)
      if (datainstanceResponse.ok) setFailuredata(failureData.data)
    }
    getFailureData()
  }, [componentName, datainstanceGet, datainstanceResponse, filterState])

  const requestToData = (request: IDataInstance[]) => {
    return (request ?? []).map((data) => [
      data.failureRates?.toString(),
      data.company,
      data.facility,
      data.du?.toString(),
      data.T?.toString(),
      new Date(data.startDate as Date).toLocaleDateString(),
      new Date(data.endDate as Date).toLocaleDateString(),
      data.populationSize?.toString(),
      data.comment,
    ])
  }

  const data = useMemo(() => requestToData(failuredataState), [
    failuredataState,
  ])

  const userContext = useContext(UserContext) as IUserContext

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
    const DuValues = data.map((failureData) => failureData.du) ?? []
    const TValues = data.map((failuredata) => failuredata.T) ?? []
    let totalDu = 0
    DuValues.forEach((value) => (totalDu += value))
    let totalT = 1
    TValues.forEach((value) => (totalT += value))
    return totalDu / (totalT - 1)
  }

  const LDU = useMemo(
    () => calculateAverageFailureRates(failuredataState ?? []),
    [failuredataState]
  )

  const averageFailureRate = LDU.toPrecision(2).toString()

  const lambdaDU = calculateAverageFailureRates(allDataInstances ?? [])
    .toPrecision(2)
    .toString()

  return componentLoad ? (
    <p>Loading...</p>
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
          <div className={styles.description}>
            <TextBox
              title="Description"
              content={compState?.description as string}
              size="large"
            />
          </div>
          <div className={styles.padding}>
            <TextBox
              title="Definition of DU"
              content={compState?.name as string} // definition of DU not in db
              size="large"
            />
          </div>
          <EditableField
            index="Date of revision"
            content={compState?.revisionDate?.toLocaleDateString()}
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
                <div className={styles.DUcontainer}>
                  <div className={styles.lambdaDU}>{'λDU: '}</div>
                  <div className={styles.lambdaDUnumber}>{lambdaDU}</div>
                  <div className={styles.lambdaDU}>
                    {'Average failure rate of displayed data: '}
                  </div>
                  <div className={styles.failureNumber}>
                    {averageFailureRate}
                  </div>
                </div>
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
