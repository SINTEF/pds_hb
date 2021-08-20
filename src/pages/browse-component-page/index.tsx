import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { Table } from '../../components/table'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { IDataInstance } from '../../models/datainstance'
import { APIResponse } from '../../models/api-response'
import Loader from 'react-loader-spinner'
import { IComponent } from '../../models/component'
import { EditableField } from '../../components/editable-field'

export const BrowseComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()
  const userContext = useContext(UserContext) as IUserContext
  const [failuredataState, setFailuredata] = useState<IDataInstance[]>([])
  const [description, setDescription] = useState<string>('')
  const [component, setComponent] = useState<IComponent[]>([])

  const headers = [
    'Source',
    'DU',
    'T',
    'Observation start',
    'Observation end',
    'Population size',
    'Failure rate (per 10^6 hours)',
  ]
  const history = useHistory()

  const {
    get: componentGet,
    put: componentPut,
    post: componentPost,
    response: componentResponse,
  } = useFetch<APIResponse<IComponent>>(`/components`, (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getComponentDescription = async () => {
      const dataRequest = `/?equipmentGroupL2=${componentName}`
      const componentData: APIResponse<IComponent[]> = await componentGet(
        dataRequest
      )
      if (componentResponse.ok) setComponent(componentData.data)
    }
    getComponentDescription()
  }, [componentName, componentGet, componentResponse, userContext.user])

  const getComponents = async () => {
    const dataRequest = `/?equipmentGroupL2=${componentName}`
    const componentData: APIResponse<IComponent[]> = await componentGet(
      dataRequest
    )
    if (componentResponse.ok) {
      setComponent(componentData.data)
      setDescription(componentData?.data[0]?.description)
    }
  }

  const postComponent = async (content: string): Promise<void> => {
    const form = {
      equipmentGroupL2: componentName,
      description: content,
    }
    await componentPost(form)
    if (componentResponse.ok) {
      getComponents()
    }
  }

  const updateComponent = (newDescription: string) => {
    if (component.length > 0) {
      componentPut(component[0]._id, {
        description: newDescription,
      })
    } else {
      postComponent(newDescription)
    }
  }

  useEffect(() => {
    getComponents()
  }, [componentGet, componentPut, componentResponse, userContext.user])

  const {
    get: datainstanceGet,
    response: datainstanceResponse,
    loading: datainstanceLoad,
  } = useFetch<APIResponse<IDataInstance>>(
    `/data-instances${
      userContext.user?.userGroupType === 'admin' ? '' : '/anonymized'
    }`,
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const getFailureData = async () => {
      const dataRequest = `/?component=${componentName}&status=published`
      const failureData = await datainstanceGet(dataRequest)
      if (datainstanceResponse.ok) setFailuredata(failureData.data)
    }
    getFailureData()
  }, [componentName, datainstanceGet, datainstanceResponse])

  const requestToData = (request: IDataInstance[]) => {
    return (request ?? []).map((data) => [
      data.facility,
      data.du?.toString(),
      data.T?.toString(),
      new Date(data.startDate as Date).toLocaleDateString(),
      new Date(data.endDate as Date).toLocaleDateString(),
      data.populationSize?.toString(),
      data.failureRate?.toString(),
    ])
  }

  const data = useMemo(() => requestToData(failuredataState), [
    failuredataState,
  ])

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

  const averageFailureRate = LDU.toPrecision(4).toString()

  return (
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
            <Title
              title={'Failure data on:'}
              dynamic={componentName?.split('+').join(' ')}
            />
          </div>
          <div className={styles.titlecontainer}>
            {'Description'}
            <hr className={styles.line} />
          </div>
          <div className={styles.description}>
            <EditableField
              type={'comment'}
              content={
                description
                  ? description
                  : 'There is no description available for this equipment group'
              }
              isAdmin={userContext.user?.userGroupType === 'admin'}
              onSubmit={(value) => updateComponent(value.content)}
            />
          </div>
          <div className={[styles.center, styles.padding].join(' ')}>
            <Title title="Failure data" />
          </div>
          {datainstanceLoad ? (
            <div className={styles.loading}>
              <Loader type="Grid" color="grey" />
            </div>
          ) : (
            <div>
              <div className={styles.table}>
                <div className={styles.DUcontainer}>
                  <div className={styles.lambdaDU}>
                    {
                      'Average failure rate of displayed data (Per 10^6 hours): '
                    }
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
