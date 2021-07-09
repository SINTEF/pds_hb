import React, { useContext, useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
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
import { INotificationGroup } from '../../models/notificationGroup'
import { IUserContext } from '../../models/user'
import MAIN_ROUTES from '../../routes/routes.constants'
import { UserContext } from '../../utils/context/userContext'
import styles from './addCommonFailurePage.module.css'

export interface Form {
  company: string | undefined
  name: string | null
  description: string | null
  type: string
  failureMode: string | undefined
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
  repeatingFailure: string | null
  commonFailure: string | null
}

export const AddCommonFailurePage: React.FC = () => {
  const history = useHistory()
  const { post, put } = useFetch()
  const userContext = useContext(UserContext) as IUserContext
  const [pageState, setPage] = useState<number>(1)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [includedNotifications, setIncluded] = useState<Array<string>>([])
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')
  const [selectedGroup, setSelectedGroup] = useState<INotificationGroup>()
  const [inSelected, setInSelected] = useState<INotification[]>([])
  const [failureModes, setFailureModes] = useState<string[]>([])
  const [notificationGroups, setNotificationGroups] = useState<
    INotificationGroup[]
  >([])

  const [dataState, setData] = useState<Form>({
    company: undefined,
    name: null,
    description: null,
    type: 'common',
    failureMode: undefined,
  })

  const {
    get: notificationGet,
    response: notificationResponse,
    loading: notificationLoad,
  } = useFetch<APIResponse<INotification>>('/notifications', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const {
    get: notificationGroupsGet,
    del: notificationGroupDel,
    loading: notificationGroupsLoad,
    response: notificationGroupsResponse,
  } = useFetch<APIResponse<INotificationGroup>>(
    '/notificationGroups',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  const getNotificationGroups = async () => {
    const dataRequest = `?company=${userContext.user?.companyName}&type=common`
    const notificationGroupData: APIResponse<
      INotificationGroup[]
    > = await notificationGroupsGet(dataRequest)
    if (notificationGroupsResponse.ok) {
      setNotificationGroups(notificationGroupData.data)
    }
  }

  useEffect(() => {
    getNotificationGroups()
  }, [notificationGroupsGet, notificationGroupsResponse, userContext.user])

  useEffect(() => {
    const getNotifications = async () => {
      const dataRequest = `/?company=${userContext.user?.companyName}&failureType=DU`
      const notificationData: APIResponse<
        INotification[]
      > = await notificationGet(dataRequest)
      if (notificationResponse.ok) {
        setNotifications(notificationData.data)
        setFailureModes(
          Object.entries(notificationData.data)
            .map((notification) =>
              notification[1].F2 ? notification[1].F2 : 'undefined'
            )
            .filter((v, i, a) => a.indexOf(v) === i)
        )
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
    form.commonFailure = dataState.name
    form.repeatingFailure = null
    await put('/notifications/' + notification._id, form)
  }

  const removeFromGroup = async (
    notification: INotification
  ): Promise<void> => {
    const form = notification as NotificationForm
    form.commonFailure = null

    await put('/notifications/' + notification._id, form)
    if (notificationResponse.ok) {
      setInSelected(
        inSelected.filter(
          (not) => not.notificationNumber !== notification.notificationNumber
        )
      )
      if (
        getCommon().filter(
          (notification) => notification.commonFailure === selectedGroup?.name
        ).length < 1
      ) {
        notificationGroupDel(selectedGroup?._id)
        getNotificationGroups()
        setPage(1)
      }
    }
  }

  const updateNotifications = async (): Promise<void> => {
    const relevantNotifications = notifications.filter((notification) =>
      includedNotifications.includes(notification.notificationNumber)
    )

    relevantNotifications.map((notification) => {
      updateNotification(notification)
    })
  }

  const getCommon = () => {
    return notifications.filter(
      (notification) => notification.commonFailure !== (undefined || null)
    )
  }

  useEffect(() => {
    setInSelected(
      getCommon().filter(
        (notification) => notification.commonFailure === selectedGroup?.name
      )
    )
    setData(selectedGroup as Form)
  }, [selectedGroup])

  if (pageState === 1) {
    return !userContext || notificationGroupsLoad || notificationLoad ? (
      <div className={styles.loading}>
        <Loader type="Grid" color="grey" />
      </div>
    ) : (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            history.push(MAIN_ROUTES.ANALYSIS)
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.title}>
          <Title title={'Add or edit common failure'} />
        </div>
        <div
          className={[styles.container, styles.firstpagebuttoncontainer].join(
            ' '
          )}
        >
          <div className={styles.menu}>
            <div className={styles.addButton}>
              <Button
                label={'Add common failure'}
                onClick={() => {
                  setPage(2)
                  setData({
                    company: undefined,
                    name: null,
                    description: null,
                    type: 'common',
                    failureMode: undefined,
                  })
                }}
              />
            </div>
            {notificationGroups.map((notificationGroup, key) => (
              <div className={styles.common} key={key}>
                <div className={styles.column}>
                  <div className={styles.commonFailureName}>
                    {notificationGroup.name}
                  </div>
                  <div className={styles.commondescription}>
                    {notificationGroups
                      .filter((group) => group.name === notificationGroup.name)
                      .map((group) => group.description)}
                  </div>
                </div>
                <i
                  onClick={() => {
                    setPage(3)
                    setSelectedGroup(notificationGroup)
                  }}
                  className={'material-icons ' + styles.bigicon}
                >
                  {'editor'}
                </i>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (pageState === 2) {
    return (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setSelectedGroup(undefined)
          }}
        >
          {'< Back'}
        </div>
        <Title title={'Add common failure'} />
        <div className={styles.data}>
          <InputField
            variant="standard"
            type="text"
            label="name"
            placeholder={
              dataState.name ? undefined : 'Name the common failure...'
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
            label="Select failure mode"
            placeholder={'Select failure mode...'}
            suggestions={failureModes}
            onValueChanged={() => false}
            variant="secondary"
            onClick={(fm) => setData({ ...dataState, failureMode: fm })}
          />
          {dataState.failureMode !== undefined ? (
            <SearchField
              variant="secondary"
              label="Notifications"
              placeholder={'Search for notifications numbers to add..'}
              suggestions={notifications
                .filter(
                  (notification) => notification.F2 === dataState.failureMode
                )
                .map((notification) => notification.notificationNumber)}
              onValueChanged={() => false}
              onClick={(notification) =>
                setIncluded([...includedNotifications, notification])
              }
            />
          ) : null}
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
                setPage(1)
                updateData(dataState)
                getNotificationGroups()
              }}
              label="Add data"
            />
          </div>
        )}
      </div>
    )
  } else if (pageState === 3) {
    return (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            getNotificationGroups()
            setData({
              company: undefined,
              name: null,
              description: null,
              type: 'common',
              failureMode: undefined,
            })
            setSelectedGroup(undefined)
          }}
        >
          {'< Back'}
        </div>
        <Title title={'Edit common error: '} dynamic={selectedGroup?.name} />
        <div>Notifications can be removed from group by clicking on them</div>
        <div className={styles.common}>
          <div className={styles.column}>
            <div className={styles.commonFailureName}>
              {selectedGroup?.name}
            </div>
            <div className={styles.commondescription}>
              {notificationGroups
                .filter((group) => group.name === selectedGroup?.name)
                .map((group) => group.description)}
            </div>
            <div className={styles.table}>
              <div>
                <table className={[styles.headers, styles.white].join(' ')}>
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
                      <td>{'QA?'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {inSelected.map((data, key) => (
              <div
                key={key}
                onClick={() => {
                  removeFromGroup(data)
                }}
              >
                <RegisteredDataField>
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
                  <label className={styles.fontSize}>{data.shortText}</label>
                  <label className={styles.fontSize}>
                    {data.detectionMethod}
                  </label>
                  <label className={styles.fontSize}>{data.F1}</label>
                  <label className={styles.fontSize}>{data.F2}</label>
                  <label className={styles.fontSize}>{data.failureType}</label>
                  {data.qualityStatus ? (
                    <i className={'material-icons ' + styles.checkedicon}>
                      {'check'}
                    </i>
                  ) : (
                    <i className={'material-icons ' + styles.notcheckedicon}>
                      {'clear'}
                    </i>
                  )}
                </RegisteredDataField>
              </div>
            ))}
          </div>
        </div>
        <SearchField
          variant="secondary"
          label="Notifications"
          placeholder={'Search for notifications numbers to add..'}
          suggestions={notifications.map(
            (notification) => notification.notificationNumber
          )}
          onValueChanged={() => false}
          onClick={(notification) => {
            setInSelected([
              ...inSelected,
              notifications.filter(
                (not) => not.notificationNumber === notification
              )[0],
            ])
            updateNotification(
              notifications.filter(
                (not) => not.notificationNumber === notification
              )[0]
            )
          }}
        />
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
