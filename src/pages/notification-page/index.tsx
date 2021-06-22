import styles from './NotificationPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { INotification } from '../../models/notification'
import { ViewLongText } from '../../components/view-long-text'
import { Button } from '../../components/button'
import { Filter } from '../../components/filter'
import Loader from 'react-loader-spinner'

export const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [viewedNotifications, setView] = useState<INotification[]>([])
  const userContext = useContext(UserContext) as IUserContext
  const history = useHistory()
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')
  const [equipmentGroups, setEquipmentGroups] = useState<
    Record<string, boolean>
  >({})
  const [tags, setTags] = useState<Record<string, boolean>>({})
  const [failureTypes, setFailureTypes] = useState<Record<string, boolean>>({})

  const {
    get: notificationGet,
    response: notificationResponse,
    loading: notificationLoad,
  } = useFetch<APIResponse<INotification>>('/notifications', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getNotifications = async () => {
      const dataRequest = `/?company=${userContext.user?.companyName}`
      const notificationData: APIResponse<
        INotification[]
      > = await notificationGet(dataRequest)
      if (notificationResponse.ok) {
        setNotifications(notificationData.data)
        setView(notificationData.data)
        setEquipmentGroups(
          Object.entries(notificationData.data)
            .map((notification) => notification[1].equipmentGroupL2)
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
        setTags(
          Object.entries(notificationData.data)
            .map((notification) => notification[1].tag)
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
        setFailureTypes(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].failureType
                ? notification[1].failureType
                : 'undefined'
            )
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
      }
    }
    getNotifications()
  }, [notificationGet, notificationResponse, userContext.user])

  useEffect(() => {
    const eqFilters = Object.entries(equipmentGroups)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const tagFilters = Object.entries(tags)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const failureTypeFilters = Object.entries(failureTypes)
      .filter((group) => group[1])
      .flatMap(([key]) => key)

    setView(
      notifications.filter(
        (notification) =>
          (eqFilters.length < 1 ||
            eqFilters.includes(notification.equipmentGroupL2)) &&
          (tagFilters.length < 1 || tagFilters.includes(notification.tag)) &&
          (failureTypeFilters.length < 1 ||
            (notification.failureType
              ? failureTypeFilters.includes(notification.failureType)
              : failureTypeFilters.includes('undefined')))
      )
    )

    if (eqFilters.length + tagFilters.length + failureTypeFilters.length < 1) {
      setView(notifications)
    }
  }, [equipmentGroups, tags, failureTypes])

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Notifications" />
      </div>
      <div className={styles.menucontainer}>
        <div className={styles.filtercontainer}>
          <Filter
            category="Equipment group L2"
            filters={equipmentGroups}
            onClick={(selected, newValue) => {
              setEquipmentGroups({
                ...equipmentGroups,
                [selected]: newValue,
              })
            }}
            key={'equipmentGroupL2'}
          />
          <Filter
            category="Tag"
            filters={tags}
            onClick={(selected, newValue) => {
              setTags({
                ...tags,
                [selected]: newValue,
              })
            }}
            key={'tag'}
          />
          <Filter
            category="Failure Type"
            filters={failureTypes}
            onClick={(selected, newValue) => {
              setFailureTypes({
                ...failureTypes,
                [selected]: newValue,
              })
            }}
            key={'failureType'}
          />
        </div>
        <div className={styles.buttoncontainer}>
          <Button
            label={'Add more notifications'}
            size="small"
            onClick={() => history.push(MAIN_ROUTES.ADD_NOTIFICATIONS)}
          />
        </div>
      </div>
      <div className={styles.notificationscontainer}>
        <div className={styles.table}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td>{'Notification number'}</td>
                  <td>{'Date'}</td>
                  <td>{'Equipment group L2'}</td>
                  <td>{'Tag'}</td>
                  <td>{'Short text (click for longer text)'}</td>
                  <td> {'Detection method'}</td>
                  <td> {'F1'}</td>
                  <td> {'F2'}</td>
                  <td> {'Failure type'}</td>
                  <td> {'Number of tests'}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          {viewedNotifications?.map((data, key) => (
            <RegisteredDataField key={key}>
              <label className={styles.fontSize}>
                {data.notificationNumber}
              </label>
              <label className={styles.fontSize}>
                {new Date(data.detectionDate as Date).toLocaleDateString()}
              </label>
              <label className={styles.fontSize}>{data.equipmentGroupL2}</label>
              <label className={styles.fontSize}>{data.tag}</label>
              <label
                onClick={() => {
                  setOpen(!open)
                  setLongText(data.longText ?? '')
                }}
                className={styles.clickable}
              >
                {data.shortText}
                <ViewLongText title="Long text" text={longText} isOpen={open} />
              </label>
              <label className={styles.fontSize}>{data.detectionMethod}</label>
              <label className={styles.fontSize}>{data.F1}</label>
              <label className={styles.fontSize}>{data.F2}</label>
              <label className={styles.fontSize}>{data.failureType}</label>
              <label className={styles.fontSize}>{data.numberOfTests}</label>
              <i
                onClick={() =>
                  history.push(
                    MAIN_ROUTES.EDIT_NOTIFICATION.replace(
                      ':notificationId',
                      data._id.replace(' ', '+')
                    )
                  )
                }
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
