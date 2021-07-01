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
import { SearchField } from '../../components/search-field'

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
  const [tags, setTags] = useState<INotification[]>([])
  const [failureTypes, setFailureTypes] = useState<Record<string, boolean>>({})
  const [years, setYears] = useState<Record<string, boolean>>({})

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
        setFailureTypes(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].failureType
                ? notification[1].failureType
                : 'undefined'
            )
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
        setYears(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].detectionDate
                ? new Date(notification[1].detectionDate)
                    .getFullYear()
                    .toString()
                : 'undefined'
            )
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
      }
    }
    getNotifications()
  }, [notificationGet, notificationResponse, userContext.user])

  useEffect(() => {
    setTags(notifications)
  }, [notifications])

  useEffect(() => {
    const eqFilters = Object.entries(equipmentGroups)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const failureTypeFilters = Object.entries(failureTypes)
      .filter((group) => group[1])
      .flatMap(([key]) => key)
    const yearFilters = Object.entries(years)
      .filter((group) => group[1])
      .flatMap(([key]) => key)

    setView(
      tags.filter(
        (notification) =>
          (eqFilters.length < 1 ||
            eqFilters.includes(notification.equipmentGroupL2)) &&
          (failureTypeFilters.length < 1 ||
            (notification.failureType
              ? failureTypeFilters.includes(notification.failureType)
              : failureTypeFilters.includes('undefined'))) &&
          (yearFilters.length < 1 ||
            yearFilters.includes(
              new Date(notification.detectionDate).getFullYear().toString()
            ))
      )
    )

    if (eqFilters.length + failureTypeFilters.length + yearFilters.length < 1) {
      setView(tags)
    }
  }, [equipmentGroups, tags, failureTypes, years])

  const calculateTotalDu = () => {
    return viewedNotifications.length
  }

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Notifications" />
      </div>
      <div className={styles.statisticsContainer}>
        <div className={styles.statisticsText}>
          {'Total  number of notifications:'}
        </div>
        <div className={styles.statisticsNumber}>{calculateTotalDu()}</div>
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
          <SearchField
            variant="small"
            label={'Tag'}
            icon={'search'}
            placeholder="Search for tags..."
            suggestions={[]}
            onValueChanged={(value) =>
              setTags(
                notifications.filter((notification) =>
                  notification.tag.toLowerCase().includes(value.toLowerCase())
                )
              )
            }
            onClick={() => false}
          />
          <Filter
            category="Year"
            filters={years}
            onClick={(selected, newValue) => {
              setYears({
                ...years,
                [selected]: newValue,
              })
            }}
            key={'year'}
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
        <div>
          <div>
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
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {viewedNotifications?.map((data, key) => (
              <RegisteredDataField key={key}>
                <label className={styles.fontSize}>
                  {data.notificationNumber}
                </label>
                <label className={styles.fontSize}>
                  {new Date(data.detectionDate as Date).toLocaleDateString()}
                </label>
                <label className={styles.fontSize}>
                  {data.equipmentGroupL2}
                </label>
                <label className={styles.fontSize}>{data.tag}</label>
                <label
                  onClick={() => {
                    setOpen(!open)
                    setLongText(data.longText ?? '')
                  }}
                  className={styles.clickable}
                >
                  {data.shortText}
                  <ViewLongText
                    title="Long text"
                    text={longText}
                    isOpen={open}
                  />
                </label>
                <label className={styles.fontSize}>
                  {data.detectionMethod}
                </label>
                <label className={styles.fontSize}>{data.F1}</label>
                <label className={styles.fontSize}>{data.F2}</label>
                <label className={styles.fontSize}>{data.failureType}</label>
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
    </div>
  )
}
