import React, { useContext, useState } from 'react'
import styles from './UpdateNotificationPage.module.css'
import useFetch, { CachePolicies } from 'use-http'
import { Title } from '../../components/title'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { useHistory, useParams } from 'react-router-dom'
import { EditableField, FieldForm } from '../../components/editable-field'
import Loader from 'react-loader-spinner'
import { Button } from '../../components/button'
import MAIN_ROUTES from '../../routes/routes.constants'

export interface IUpdateNotification {
  company: string
  notificationNumber: string
  detectionDate: Date
  equipmentGroupL2: string
  tag: string
  shortText: string
  longText: string
  detectionMethod: string
  F1: string
  F2: string
  failureType: string
  numberOfTests: number
}

export const UpdateNotificationPage: React.FC = () => {
  const history = useHistory()
  const { notificationId } = useParams<{ notificationId: string }>()
  const [pageState, setPage] = useState<number>(1)
  const {
    put: notificationPut,
    data: notification,
    del: notificationDel,
    response: notificationResponse,
    error: notificationError,
    loading: notificationLoading,
  } = useFetch(
    '/notifications/' + notificationId,
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )
  const userContext = useContext(UserContext) as IUserContext

  const handleUpdate = (form: FieldForm) => {
    const notificationData: { [id: string]: string } = {}
    const index = form.index

    switch (index) {
      case 'Edit notification number':
        notificationData['notificationNumber'] = form.content
        break
      case 'Edit equipment group/L2':
        notificationData['equipmentGroupL2'] = form.content
        break
      case 'Edit tag':
        notificationData['tag'] = form.content
        break
      case 'Edit short text':
        notificationData['shortText'] = form.content
        break
      case 'Edit long text':
        notificationData['longText'] = form.content
        break
      case 'Edit detection method':
        notificationData['detectionMethod'] = form.content
        break
      case 'Edit F1':
        notificationData['F1'] = form.content
        break
      case 'Edit F2':
        notificationData['F2'] = form.content
        break
      case 'Edit failure Type':
        notificationData['failureType'] = form.content
        break
      case 'Edit number of tests':
        notificationData['numberOfTests'] = form.content
        break
    }
    notificationPut(notificationData)
  }

  const deleteNotification = async () => {
    await notificationDel()
    if (notificationResponse.ok) {
      history.push(MAIN_ROUTES.NOTIFICATIONS)
    } else setPage(1)
  }

  return (
    <div>
      {notificationLoading && !notification ? (
        <div className={styles.loading}>
          <Loader type="Grid" color="grey" />
        </div>
      ) : (
        <>
          {pageState === 0 && (
            <div className={styles.loading}>
              <Loader type="Grid" color="grey" />
            </div>
          )}
          {userContext.user?.userGroupType === 'operator' && pageState === 1 && (
            <div className={styles.container}>
              <Title
                title={'Edit Notification no: '}
                dynamic={notification.data.notificationNumber}
              />
              <div className={styles.data}>
                <EditableField
                  index="Edit notification number"
                  content={notification.data.notificationNumber}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit equipment group/L2"
                  content={notification.data.equipmentGroupL2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit tag"
                  content={notification.data.tag}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit short text"
                  content={notification.data.shortText}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit long text"
                  content={notification.data.longText}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit detection method"
                  content={notification.data.detectionMethod}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit F1"
                  content={notification.data.F1}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit F2"
                  content={notification.data.F2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit failure type"
                  content={notification.data.failureType}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit number of tests"
                  content={notification.data.numberOfTests}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                {/*notification.data.sintefComment !== 'No comment' && (
                  <EditableField
                    index="SINTEF comment"
                    content={notification.data.sintefComment}
                    isAdmin={false}
                    onSubmit={() => false}
                  />
                )*/}
                <div className={styles.button}>
                  <div
                    className={styles.back}
                    onClick={() => history.push(MAIN_ROUTES.NOTIFICATIONS)}
                  >
                    {'< Back'}
                  </div>
                  <Button
                    type="danger"
                    label="Delete"
                    size="small"
                    onClick={() => {
                      setPage(0)
                      deleteNotification()
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {userContext.user?.userGroupType === 'admin' && pageState === 1 && (
            <div className={styles.container}>
              <Title
                title={'Edit notification no:'}
                dynamic={notification.data.notificationNumber}
              />
              <div className={styles.data}>
                <EditableField
                  index="Edit Notification number"
                  content={notification.data.notificationNumber}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit equipment group/L2"
                  content={notification.data.equipmentGroupL2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit tag"
                  content={notification.data.tag}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit short text"
                  content={notification.data.shortText}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit long text"
                  content={notification.data.longText}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit detection method"
                  content={notification.data.detectionMethod}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit F1"
                  content={notification.data.F1}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit F2"
                  content={notification.data.F2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit failure type"
                  content={notification.data.failureType}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit number of tests"
                  content={notification.data.numberOfTests}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <div
                  className={styles.back}
                  onClick={() => history.push(MAIN_ROUTES.NOTIFICATIONS)}
                >
                  {'< Back'}
                </div>
              </div>
            </div>
          )}
          {notificationResponse.ok ? (
            <p className={styles.responseOk}>
              {notificationResponse.data?.message}
            </p>
          ) : null}
          {notificationError ? (
            <p className={styles.responseError}>
              {notificationResponse.data?.message}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
