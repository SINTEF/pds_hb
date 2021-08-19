import React, { useContext, useEffect, useState } from 'react'
import styles from './AddNotificationsPage.module.css'
import useFetch, { CachePolicies } from 'use-http'
import { Title } from '../../components/title'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { useHistory } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

import * as XLSX from 'xlsx'
import { RegisteredDataField } from '../../components/registered-data-field'
import { ViewLongText } from '../../components/view-long-text'
import Loader from 'react-loader-spinner'
import { APIResponse } from '../../models/api-response'
import { IInventoryInstance } from '../../models/inventoryinstance'

export interface Form {
  company: string | undefined
  notificationNumber: string | null
  detectionDate: Date
  equipmentGroupL2: string | null
  tag: string | null
  shortText: string | null
  longText: string | null
  workOrder: string | null
  activityText: string | null
  detectionMethod: string | null
  F1: string | null
  F2: string | null
  failureType: string | null
}

export interface PeriodForm {
  company: string | undefined
  tag: string | null
  startDate: Date
  endDate: Date
}

export const AddNotificationsPage: React.FC = () => {
  const history = useHistory()
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

  const userContext = useContext(UserContext) as IUserContext

  const [pageState, setPage] = useState<number>(1)

  const [uploadOk, setUploadOk] = useState<boolean>(false)

  const [tags, setTags] = useState<string[]>([])

  const [dataState, setData] = useState<Form>({
    company: undefined,
    notificationNumber: null,
    detectionDate: new Date(),
    equipmentGroupL2: null,
    tag: null,
    shortText: '',
    longText: '',
    workOrder: null,
    activityText: '',
    detectionMethod: null,
    F1: null,
    F2: null,
    failureType: null,
  })

  const [notifications, setNotifications] = useState<Array<Form>>([])
  const [periods, setPeriods] = useState<Array<PeriodForm>>([])
  const [successNumber, setSuccess] = useState<number>(0)

  //eslint-disable-next-line
  const notificationsFromExcel = (data: any) => {
    //eslint-disable-next-line
    data.forEach((d: any) => {
      d = {
        company: undefined,
        notificationNumber: (d['Notification no.'] ?? '') as string,
        detectionDate: new Date(Date.UTC(0, 0, d['Date'], -24)) ?? new Date(), //must be changed if hours is important as it does not concider summer time
        equipmentGroupL2: (d['Eq. Group L2'] ?? '') as string,
        tag: (d['Tag no./FL'] ?? '') as string,
        shortText: (d['Short text'] ?? '') as string,
        longText: (d['Long text'] ?? '') as string,
        workOrder: (d['Work order'] ?? '') as string,
        activityText: (d['Activity text'] ?? '') as string,
        detectionMethod: (d['Detection method (D2)'] ?? '') as string,
        F1: (d['Failure mode (F1)'] ?? '') as string,
        F2: (d['Failure mode (F2)'] ?? '') as string,
        failureType: (d['Failure type'] ?? '').toUpperCase() as string,
        commonError: d['Common error'] ?? undefined,
      } as Form
      setNotifications((notifications) => [...notifications, d])
    })
  }

  //eslint-disable-next-line
  const periodFromExcel = (data: any) => {
    //eslint-disable-next-line
    data.forEach((d: any) => {
      d = {
        company: undefined,
        tag: (d['Tag no./FL'] ?? '') as string,
        startDate: new Date(Date.UTC(0, 0, d['Start date'], -24)) ?? new Date(), //must be changed if hours is important as it does not concider summer time
        endDate: new Date(Date.UTC(0, 0, d['End date'], -24)) ?? new Date(),
      } as PeriodForm
      setPeriods((periods) => [...periods, d])
    })
  }

  const readExcel = (file: File, type: string) => {
    const promise = new Promise(
      (resolve: (value: Array<unknown>) => void, reject) => {
        const fileReader = new FileReader()
        const fileType = 'xlsx'
        fileReader.readAsArrayBuffer(file)
        if (file.name.split('.').pop()?.toLowerCase() === fileType) {
          fileReader.onload = (e) => {
            if (e.target !== null) {
              const bufferArray = e.target.result

              const workBook = XLSX.read(bufferArray, { type: 'buffer' })

              const workSheetname = workBook.SheetNames[0]

              const workSheet = workBook.Sheets[workSheetname]

              const data = XLSX.utils.sheet_to_json(workSheet)

              resolve(data)
            }
          }

          fileReader.onerror = (error) => {
            setNotifications([])
            reject(error)
          }
        }
      }
    )

    promise.then((data) => {
      if (type === 'notification') {
        notificationsFromExcel(data)
      }
      if (type === 'period') {
        periodFromExcel(data)
      }
      setUploadOk(true)
    })
  }

  const {
    get: inventoryInstanceGet,
    response: inventoryInstanceResponse,
    //loading: inventoryInstanceLoad,
  } = useFetch<APIResponse<IInventoryInstance>>(
    '/inventoryInstances',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const getInventory = async () => {
      const dataRequest = `?company=${userContext.user?.companyName}`
      const inventoryData: APIResponse<
        IInventoryInstance[]
      > = await inventoryInstanceGet(dataRequest)
      if (inventoryInstanceResponse.ok) {
        setTags(
          Object.entries(inventoryData.data).map(
            (datainstance) => datainstance[1].tag
          )
        )
      }
    }
    getInventory()
  }, [inventoryInstanceGet, inventoryInstanceResponse, userContext.user])

  const valid_notification = () => {
    return (
      dataState.notificationNumber &&
      dataState.detectionDate &&
      dataState.tag &&
      dataState.equipmentGroupL2
    )
  }

  const valid_notifications = () => {
    return notifications.every(
      (notification) =>
        notification.notificationNumber &&
        notification.detectionDate &&
        notification.tag &&
        notification.equipmentGroupL2
    )
  }

  const valid_periods = () => {
    return periods.every(
      (period) => period.tag && period.startDate && period.endDate
    )
  }

  const hasNotificationNumber = () => {
    return notifications.every(
      (notification) => notification.notificationNumber
    )
  }

  const hasDate = () => {
    return notifications.every((notification) => notification.detectionDate)
  }

  const hasEqGroup = () => {
    return notifications.every((notification) => notification.equipmentGroupL2)
  }

  const hasTag = () => {
    return notifications.every((notification) => notification.tag)
  }

  const {
    response: notificationResponse,
    post: notificationPost,
    loading: notificationLoad,
  } = useFetch(
    '/notifications',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )
  const {
    //response: periodResponse,
    post: periodPost,
    loading: periodLoad,
  } = useFetch(
    '/periods',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }
    await notificationPost(form)
    if (notificationResponse.ok) {
      setSuccess((successNumber) => successNumber + 1)
    }
  }

  const tagNotInPeriod = () => {
    return tagInInventory().filter(
      (notification) =>
        !periods.map((period) => period.tag).includes(notification.tag)
    )
  }

  const tagInPeriod = () => {
    return tagInInventory().filter((notification) =>
      periods.map((period) => period.tag).includes(notification.tag)
    )
  }

  const tagInInventory = () => {
    return notifications.filter((notification) =>
      tags.includes(notification.tag ? notification.tag : '')
    )
  }

  const tagNotInInventory = () => {
    return notifications.filter(
      (notification) => !tags.includes(notification.tag ? notification.tag : '')
    )
  }

  const updateMultipleNotifications = () => {
    tagInPeriod().map((notification) => updateData(notification))
  }

  const updatePeriodData = async (form: PeriodForm): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }
    await periodPost(form)
  }

  const updateMultiplePeriods = () => {
    periods.map((period) => updatePeriodData(period))
  }

  if (pageState === 1) {
    return !userContext ? (
      <div className={styles.loading}>
        <Loader type="Grid" color="grey" />
      </div>
    ) : (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            history.push(MAIN_ROUTES.NOTIFICATIONS)
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.title}>
          <Title title={'Add notification'} />
        </div>
        <div
          className={[styles.container, styles.firstpagebuttoncontainer].join(
            ' '
          )}
        >
          <InputField
            variant="primary"
            type="file"
            label="Upload file"
            value=" "
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            //data-max-size="2048"
            onValueChanged={(e) => {
              const file = (e as FileList)[0]
              readExcel(file, 'notification')
              setPage(2)
              setSuccess(0)
            }}
          />

          <Button
            label={'Add notification manually'}
            onClick={() => {
              setData({
                ...dataState,
                company: dataState.company,
                notificationNumber: null,
                detectionDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                shortText: '',
                longText: '',
                workOrder: null,
                activityText: '',
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
              })
              setPage(3)
            }}
          />
        </div>
      </div>
    )
  } else if (pageState === 2) {
    return !uploadOk || !userContext ? (
      <div className={styles.loading}>
        <Loader type="Grid" color="grey" />
      </div>
    ) : (
      <div className={styles.notificationcontainer}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setNotifications([])
            setUploadOk(false)
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.center}>
          <Title title={'Does this look right?'} />
        </div>
        <div className={styles.previewpagebuttoncontainer}>
          {valid_notifications() && (
            <Button
              label="Continue"
              size="small"
              onClick={() => {
                setPage(4)
              }}
            />
          )}
          {!valid_notifications() && (
            <div className={styles.infotext}>
              Some of your notifications are missing required data!
            </div>
          )}
        </div>
        <div className={styles.table}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td
                    className={
                      hasNotificationNumber() ? undefined : styles.required
                    }
                  >
                    {'Notification number'}
                  </td>
                  <td className={hasDate() ? undefined : styles.required}>
                    {'Date'}
                  </td>
                  <td className={hasEqGroup() ? undefined : styles.required}>
                    {'Equipment group L2'}
                  </td>
                  <td className={hasTag() ? undefined : styles.required}>
                    {'Tag'}
                  </td>
                  <td>{'Short text (click for long text)'}</td>
                  <td>{'Work order'}</td>
                  <td>{'Activity text'}</td>
                  <td> {'Detection method'}</td>
                  <td> {'F1'}</td>
                  <td> {'F2'}</td>
                  <td> {'Failure type'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {tagInInventory().map((notification, key) => (
          <RegisteredDataField key={key}>
            <label className={styles.fontSize}>
              {notification.notificationNumber}
            </label>
            <label className={styles.fontSize}>
              {new Date(
                notification.detectionDate as Date
              ).toLocaleDateString()}
            </label>
            <label className={styles.fontSize}>
              {notification.equipmentGroupL2}
            </label>
            <label className={styles.fontSize}>{notification.tag}</label>
            <label
              onClick={() => {
                setOpen(!open)
                setLongText(notification.longText ?? '')
              }}
              className={styles.clickable}
            >
              {notification.shortText}
              <ViewLongText title="Long text" text={longText} isOpen={open} />
            </label>
            <label className={styles.fontSize}>{notification.workOrder}</label>
            <label className={styles.fontSize}>
              {notification.activityText}
            </label>
            <label className={styles.fontSize}>
              {notification.detectionMethod}
            </label>
            <label className={styles.fontSize}>{notification.F1}</label>
            <label className={styles.fontSize}>{notification.F2}</label>
            <label className={styles.fontSize}>
              {notification.failureType}
            </label>
          </RegisteredDataField>
        ))}
        {tagNotInInventory().length > 0 && (
          <div className={styles.infotext}>
            Following notifications will not be added as their tags are missing
            from the period document
          </div>
        )}
        {tagNotInInventory().map((notification, key) => (
          <RegisteredDataField key={key}>
            <label className={styles.fontSize}>
              {notification.notificationNumber}
            </label>
            <label className={styles.fontSize}>
              {new Date(
                notification.detectionDate as Date
              ).toLocaleDateString()}
            </label>
            <label className={styles.fontSize}>
              {notification.equipmentGroupL2}
            </label>
            <label className={styles.fontSize}>{notification.tag}</label>
            <label
              onClick={() => {
                setOpen(!open)
                setLongText(notification.longText ?? '')
              }}
              className={styles.clickable}
            >
              {notification.shortText}
              <ViewLongText title="Long text" text={longText} isOpen={open} />
            </label>
            <label className={styles.fontSize}>{notification.workOrder}</label>
            <label className={styles.fontSize}>
              {notification.activityText}
            </label>
            <label className={styles.fontSize}>
              {notification.detectionMethod}
            </label>
            <label className={styles.fontSize}>{notification.F1}</label>
            <label className={styles.fontSize}>{notification.F2}</label>
            <label className={styles.fontSize}>
              {notification.failureType}
            </label>
          </RegisteredDataField>
        ))}
      </div>
    )
  } else if (pageState === 3) {
    return (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setNotifications([])
          }}
        >
          {'< Back'}
        </div>
        <Title title={'Add notification'} />
        <div className={styles.data}>
          <InputField
            variant="standard"
            type="text"
            label="notification number*"
            placeholder={
              dataState.notificationNumber
                ? undefined
                : 'Type in notification number...'
            }
            value={dataState.notificationNumber ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, notificationNumber: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="date"
            label="date*"
            placeholder={dataState.detectionDate ? undefined : 'dd-mm-yyyy...'}
            value={dataState.detectionDate}
            onValueChanged={(value) => {
              setData({ ...dataState, detectionDate: value as Date })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="equipment group L2*"
            placeholder={
              dataState.equipmentGroupL2
                ? undefined
                : 'Type in equipment group...'
            }
            value={dataState.equipmentGroupL2 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, equipmentGroupL2: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="tag*"
            placeholder={dataState.tag ? undefined : 'Type in tag...'}
            value={dataState.tag ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, tag: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="short text"
            placeholder={
              dataState.shortText ? undefined : 'Provide a short description...'
            }
            value={dataState.shortText ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, shortText: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="long text"
            placeholder={
              dataState.longText ? undefined : 'Provide a longer description...'
            }
            value={dataState.longText ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, longText: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="work order"
            placeholder={
              dataState.longText ? undefined : 'Type in work order...'
            }
            value={dataState.workOrder ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, workOrder: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="activity text"
            placeholder={
              dataState.longText ? undefined : 'Provide an activity text...'
            }
            value={dataState.activityText ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, activityText: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="detection method"
            placeholder={
              dataState.detectionMethod
                ? undefined
                : 'Type in detection method ...'
            }
            value={dataState.detectionMethod ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, detectionMethod: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="failure mode (F1)"
            placeholder={dataState.F1 ? undefined : 'Type in failure mode...'}
            value={dataState.F1 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, F1: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="failure mode (F2)"
            placeholder={dataState.F2 ? undefined : 'Type in failure mode...'}
            value={dataState.F2 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, F2: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="failure type"
            placeholder={
              dataState.failureType ? undefined : 'Type in failure type...'
            }
            value={dataState.failureType ?? undefined}
            onValueChanged={(value) => {
              setData({
                ...dataState,
                failureType: (value as string).toUpperCase(),
              })
            }}
          />
        </div>
        {!valid_notification() && (
          <div className={styles.infotext}>Missing required fields *</div>
        )}
        {valid_notification() && (
          <div className={styles.button}>
            <Button
              onClick={() => {
                updateData(dataState)
                history.push(MAIN_ROUTES.NOTIFICATIONS)
              }}
              label="Add data"
            />
          </div>
        )}
      </div>
    )
  }
  if (pageState === 4) {
    return (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setNotifications([])
            setUploadOk(false)
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.title}>
          <Title title={'Add observation periods'} />
        </div>
        <div
          className={[styles.container, styles.firstpagebuttoncontainer].join(
            ' '
          )}
        >
          <InputField
            variant="primary"
            type="file"
            label="Upload file"
            value=" "
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            //data-max-size="2048"
            onValueChanged={(e) => {
              const file = (e as FileList)[0]
              setUploadOk(false)
              readExcel(file, 'period')
              setPage(5)
            }}
          />
        </div>
      </div>
    )
  } else if (pageState === 5) {
    return !uploadOk || !userContext ? (
      <div className={styles.loading}>
        <Loader type="Grid" color="grey" />
      </div>
    ) : (
      <div>
        <div className={styles.notificationcontainer}>
          <div
            className={styles.back}
            onClick={() => {
              setPage(1)
              setPeriods([])
              setUploadOk(false)
            }}
          >
            {'< Back'}
          </div>
          <div className={styles.center}>
            <Title title={'Does this look right?'} />
          </div>
          <div className={styles.previewpagebuttoncontainer}>
            {valid_periods() && (
              <Button
                label="Save"
                size="small"
                onClick={() => {
                  updateMultipleNotifications()
                  updateMultiplePeriods()
                  setPage(6)
                }}
              />
            )}
            {!valid_periods() && (
              <div className={styles.infotext}>
                Some of your periods are missing required data!
              </div>
            )}
          </div>
          <div className={styles.periodcontainer}>
            <div className={styles.table}>
              <div>
                <table className={styles.headers}>
                  <tbody>
                    <tr>
                      <td> {'Tag'}</td>
                      <td> {'Period Start'}</td>
                      <td>{'Period end'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {periods?.map((period, key) => (
              <RegisteredDataField key={key}>
                <label className={styles.fontSize}>{period.tag}</label>
                <label className={styles.fontSize}>
                  {new Date(period.startDate as Date).toLocaleDateString()}
                </label>
                <label className={styles.fontSize}>
                  {new Date(period.endDate as Date).toLocaleDateString()}
                </label>
              </RegisteredDataField>
            ))}
          </div>
          {tagNotInPeriod().length > 0 ? (
            <div>
              <div className={styles.infotext}>
                Following notifications will not be added as their tags are
                missing from the period document
              </div>
              <div className={styles.table}>
                <div>
                  <table className={styles.headers}>
                    <tbody>
                      <tr>
                        <td
                          className={
                            hasNotificationNumber()
                              ? undefined
                              : styles.required
                          }
                        >
                          {'Notification number'}
                        </td>
                        <td className={hasDate() ? undefined : styles.required}>
                          {'Date'}
                        </td>
                        <td
                          className={hasEqGroup() ? undefined : styles.required}
                        >
                          {'Equipment group L2'}
                        </td>
                        <td className={hasTag() ? undefined : styles.required}>
                          {'Tag'}
                        </td>
                        <td>{'Short text (click for long text)'}</td>
                        <td>{'Work order'}</td>
                        <td>{'Activity text'}</td>
                        <td> {'Detection method'}</td>
                        <td> {'F1'}</td>
                        <td> {'F2'}</td>
                        <td> {'Failure type'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {tagNotInPeriod()?.map((notification, key) => (
                <RegisteredDataField key={key}>
                  <label className={styles.fontSize}>
                    {notification.notificationNumber}
                  </label>
                  <label className={styles.fontSize}>
                    {new Date(
                      notification.detectionDate as Date
                    ).toLocaleDateString()}
                  </label>
                  <label className={styles.fontSize}>
                    {notification.equipmentGroupL2}
                  </label>
                  <label className={styles.fontSize}>{notification.tag}</label>
                  <label
                    onClick={() => {
                      setOpen(!open)
                      setLongText(notification.longText ?? '')
                    }}
                    className={styles.clickable}
                  >
                    {notification.shortText}
                    <ViewLongText
                      title="Long text"
                      text={longText}
                      isOpen={open}
                    />
                  </label>
                  <label className={styles.fontSize}>
                    {notification.workOrder}
                  </label>
                  <label className={styles.fontSize}>
                    {notification.activityText}
                  </label>
                  <label className={styles.fontSize}>
                    {notification.detectionMethod}
                  </label>
                  <label className={styles.fontSize}>{notification.F1}</label>
                  <label className={styles.fontSize}>{notification.F2}</label>
                  <label className={styles.fontSize}>
                    {notification.failureType}
                  </label>
                </RegisteredDataField>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    )
  } else if (pageState === 6) {
    return notificationLoad || periodLoad || !userContext ? (
      <div className={styles.loading}>
        <Loader type="Grid" color="grey" />
      </div>
    ) : (
      <div className={styles.container}>
        <Title title={'Add notification'} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {`${successNumber} of ${notifications.length} notifications successfully added!`}
          <Button
            label={'Add more notifications'}
            onClick={() => {
              setData({
                ...dataState,
                company: dataState.company,
                notificationNumber: null,
                detectionDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                shortText: '',
                longText: '',
                workOrder: null,
                activityText: '',
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
              })
              setNotifications([])
              setPage(1)
            }}
          />
          <Button
            label={'See all registered data'}
            onClick={() => {
              history.push(MAIN_ROUTES.NOTIFICATIONS)
              setData({
                ...dataState,
                company: dataState.company,
                notificationNumber: null,
                detectionDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                shortText: '',
                longText: '',
                workOrder: null,
                activityText: '',
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
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
