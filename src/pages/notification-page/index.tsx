import styles from './NotificationPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { INotification } from '../../models/notification'
import { ViewLongText } from '../../components/view-long-text'
import { Button } from '../../components/button'

export const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const userContext = useContext(UserContext) as IUserContext
  const history = useHistory()
  const { url } = useRouteMatch()
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

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
      const dataRequest = `?company=${userContext.user?.companyName}`
      const notificationData = await notificationGet(dataRequest)
      if (notificationResponse.ok) setNotifications(notificationData.data)
    }
    getNotifications()
  }, [notificationGet, notificationResponse, userContext.user])

  return notificationLoad ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Notifications" />
      </div>
      <div className={styles.filtercontainer}>
        <Button
          label={'Add notifications'}
          size="small"
          onClick={() => history.push(MAIN_ROUTES.ADD_NOTIFICATIONS)}
        />
      </div>
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
                <td> {'Test interval'}</td>
                <td> {'Number of tests'}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {notifications?.map((data, key) => (
          <RegisteredDataField key={key}>
            <label className={styles.fontSize}>{data.notificationNumber}</label>
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
            <label className={styles.fontSize}>{data.testInterval}</label>
            <label className={styles.fontSize}>{data.numberOfTests}</label>
            <i
              onClick={() =>
                history.push(
                  url +
                    SUB_ROUTES.UPDATE.replace(
                      ':datainstanceId',
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
  )
}
