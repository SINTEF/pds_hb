import React, { useContext } from 'react'
import styles from './UpdateDataPage.module.css'
import useFetch, { CachePolicies } from 'use-http'
import { Title } from '../../components/title'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import { EditableField, FieldForm } from '../../components/editable-field'
import Loader from 'react-loader-spinner'

export interface IUpdateData {
  company: string
  facility: string
  T: number
  du: number
  populationSize: number
  comment: string
  sintefComment: string
}

export const UpdateDataPage: React.FC = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { datainstanceId } = useParams<{ datainstanceId: string }>()
  const {
    put: datainstancePut,
    data: datainstance,
    response: datainstanceResponse,
    error: datainstanceError,
    loading: datainstanceLoading,
  } = useFetch(
    '/data-instances/' + datainstanceId,
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )
  const userContext = useContext(UserContext) as IUserContext

  const handleUpdate = (form: FieldForm) => {
    const data: { [id: string]: string } = {}
    const index = form.index

    switch (index) {
      case 'Edit T':
        data['T'] = form.content
        break
      case 'Edit DU':
        data['du'] = form.content
        break
      case 'Edit Populationsize':
        data['populationSize'] = form.content
        break
      case 'Edit comment':
        data['comment'] = form.content
        break
      case 'Edit SINTEF comment':
        data['sintefComment'] = form.content
        break
    }

    datainstancePut(data)
  }

  return (
    <div>
      {datainstanceLoading && !datainstance ? (
        // This is not pretty, since it isn't centered
        <Loader type="Grid" color="grey" />
      ) : (
        <>
          {userContext.user?.userGroupType === 'operator' && (
            <div className={styles.container}>
              <Title
                title={'Failure data registered at'}
                dynamic={datainstance.data.facility}
              />
              <div className={styles.data}>
                <EditableField
                  index="Edit T"
                  content={datainstance.data.T.toString()}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit DU"
                  content={datainstance.data.du.toString()}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit populationsize"
                  content={datainstance.data.populationSize.toString()}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit comment"
                  content={datainstance.data.comment}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                {datainstance.data.sintefComment !== 'No comment' && (
                  <EditableField
                    index="SINTEF comment"
                    content={datainstance.data.sintefComment}
                    isAdmin={false}
                    onSubmit={() => false}
                  />
                )}
                <div
                  className={styles.back}
                  onClick={() => history.push(url.replace(datainstanceId, ''))}
                >
                  {'< Back'}
                </div>
              </div>
            </div>
          )}
          {userContext.user?.userGroupType === 'admin' && (
            <div className={styles.container}>
              <Title
                title={'Failure data for ' + datainstance.data.company + ' at'}
                dynamic={datainstance.data.facility}
              />
              <div className={styles.data}>
                <EditableField
                  index="T"
                  content={datainstance.data.T.toString()}
                  isAdmin={false}
                  onSubmit={() => false}
                />
                <EditableField
                  index="DU"
                  content={datainstance.data.du.toString()}
                  isAdmin={false}
                  onSubmit={() => false}
                />
                <EditableField
                  index="Populationsize"
                  content={datainstance.data.populationSize.toString()}
                  isAdmin={false}
                  onSubmit={() => false}
                />
                <EditableField
                  index="Comment"
                  content={datainstance.data.comment}
                  isAdmin={false}
                  onSubmit={() => false}
                />
                <EditableField
                  index="Edit SINTEF comment"
                  content={datainstance.data.sintefComment}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <div
                  className={styles.back}
                  onClick={() => history.push(url.replace(datainstanceId, ''))}
                >
                  {'< Back'}
                </div>
              </div>
            </div>
          )}
          {datainstanceResponse.ok ? (
            <p className={styles.responseOk}>
              {datainstanceResponse.data?.message}
            </p>
          ) : null}
          {datainstanceError ? (
            <p className={styles.responseError}>
              {datainstanceResponse.data?.message}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
