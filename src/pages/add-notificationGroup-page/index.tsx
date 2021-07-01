import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { RegisteredDataField } from '../../components/registered-data-field'
import { SearchField } from '../../components/search-field'
import { Title } from '../../components/title'
import { ViewLongText } from '../../components/view-long-text'
import { APIResponse } from '../../models/api-response'
import { INotification } from '../../models/notification'
import { IUserContext } from '../../models/user'
import MAIN_ROUTES from '../../routes/routes.constants'
import { UserContext } from '../../utils/context/userContext'
import styles from './addNotificationGroupPage.module.css'

export interface Form {
  company: string | undefined
  name: string | null
  description: string | null
}

export interface NotificationForm {
  company: string | undefined
  notificationNumber: string | null
  detectionDate: Date
  equipmentGroupL2: string | null
  tag: string | null
  shortText: string | null
  longText: string | null
  detectionMethod: string | null
  F1: string | null
  F2: string | null
  failureType: string | null
  commonError: string | null
}

export const AddNotificationGroupPage: React.FC = () => {
  const history = useHistory()
  const { post, put } = useFetch()
  const userContext = useContext(UserContext) as IUserContext
  const [pageState, setPage] = useState<number>(1)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [includedNotifications, setIncluded] = useState<Array<string>>([])
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

  const [dataState, setData] = useState<Form>({
    company: undefined,
    name: null,
    description: null,
  })

  const {
    get: notificationGet,
    response: notificationResponse,
    //loading: notificationLoad,
  } = useFetch<APIResponse<INotification>>('/notifications', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getNotifications = async () => {
      const dataRequest = `/?company=${userContext.user?.companyName}&failureType=DU`
      const notificationData: APIResponse<
        INotification[]
      > = await notificationGet(dataRequest)
      if (notificationResponse.ok) {
        setNotifications(notificationData.data)
      }
    }
    getNotifications()
  }, [notificationGet, notificationResponse, userContext.user])

  const validNotificationGroup = () => {
    return dataState.name
  }
  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }

    await post('/notificationGroups/', form)

    updateNotifications()
  }

  const updateNotification = async (
    notification: INotification
  ): Promise<void> => {
    const form = notification as NotificationForm
    form.commonError = dataState.name
    await put('/notifications/' + notification._id, form)
  }

  const updateNotifications = async (): Promise<void> => {
    const relevantNotifications = notifications.filter((notification) =>
      includedNotifications.includes(notification.notificationNumber)
    )

    relevantNotifications.map((notification) => {
      updateNotification(notification)
    })
  }

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title={'Add common cause error'} />
        <div className={styles.data}>
          <InputField
            variant="standard"
            type="text"
            label="name"
            placeholder={
              dataState.name ? undefined : 'Name the common cause error...'
            }
            value={dataState.name ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, name: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="description"
            placeholder={
              dataState.description ? undefined : 'Provide a description...'
            }
            value={dataState.description ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, description: value as string })
            }}
          />
          <SearchField
            variant="secondary"
            label="Notifications"
            placeholder={'Search for notifications numbers to add..'}
            suggestions={notifications.map(
              (notification) => notification.notificationNumber
            )}
            onValueChanged={() => false}
            onClick={(notification) =>
              setIncluded([...includedNotifications, notification])
            }
          />
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
              {notifications
                .filter((notification) =>
                  includedNotifications.includes(
                    notification.notificationNumber
                  )
                )
                ?.map((data, key) => (
                  <RegisteredDataField key={key}>
                    <label className={styles.fontSize}>
                      {data.notificationNumber}
                    </label>
                    <label className={styles.fontSize}>
                      {new Date(
                        data.detectionDate as Date
                      ).toLocaleDateString()}
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
                    <label className={styles.fontSize}>
                      {data.failureType}
                    </label>
                    <i
                      onClick={() =>
                        setIncluded(
                          includedNotifications.filter(
                            (notificationNumber) =>
                              notificationNumber !== data.notificationNumber
                          )
                        )
                      }
                      className={'material-icons ' + styles.icon}
                    >
                      {'close'}
                    </i>
                  </RegisteredDataField>
                ))}
            </div>
          </div>
        </div>

        {validNotificationGroup() && (
          <div className={styles.button}>
            <Button
              onClick={() => {
                setPage(2)
                updateData(dataState)
              }}
              label="Add data"
            />
          </div>
        )}
      </div>
    )
  } else if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title={'Common cause error'} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {'Data successfully added!'}
          <Button
            label={'Add more data'}
            onClick={() => {
              setData({
                ...dataState,
                name: null,
                description: null,
              })
              setPage(1)
            }}
          />
          <Button
            label={'Back to analysis'}
            onClick={() => {
              history.push(MAIN_ROUTES.ANALYSIS)
              setData({
                ...dataState,
                name: null,
                description: null,
              })
            }}
          />
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
