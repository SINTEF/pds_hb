import React, { useContext, useState } from 'react'
import styles from './AddNotificationsPage.module.css'
import useFetch from 'use-http'
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

export interface Form {
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
  numberOfTests: number | null
}

export const AddNotificationsPage: React.FC = () => {
  const history = useHistory()
  const { post } = useFetch()
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

  const userContext = useContext(UserContext) as IUserContext

  const [pageState, setPage] = useState<number>(1)

  const [dataState, setData] = useState<Form>({
    company: undefined,
    notificationNumber: null,
    detectionDate: new Date(),
    equipmentGroupL2: null,
    tag: null,
    shortText: '',
    longText: '',
    detectionMethod: null,
    F1: null,
    F2: null,
    failureType: null,
    numberOfTests: null,
  })

  const [notifications, setNotifications] = useState<Array<Form>>([])

  const readExcel = (file: File) => {
    const promise = new Promise(
      (resolve: (value: Array<Form>) => void, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)

        fileReader.onload = (e) => {
          if (e.target !== null) {
            const bufferArray = e.target.result

            const workBook = XLSX.read(bufferArray, { type: 'buffer' })

            const workSheetname = workBook.SheetNames[0]

            const workSheet = workBook.Sheets[workSheetname]

            const data = XLSX.utils.sheet_to_json(workSheet)

            //eslint-disable-next-line
            data.forEach((d: any) => {
              d = {
                company: undefined,
                notificationNumber: (d['Notification no.'] ?? '') as string,
                detectionDate:
                  new Date(Date.UTC(0, 0, d['Date'], -25)) ?? new Date(), //must be changed if hours is important as it does not concider summer time
                equipmentGroupL2: (d['Eq. Group L2'] ?? '') as string,
                tag: (d['Tag no./FL'] ?? '') as string,
                shortText: (d['Short text'] ?? '') as string,
                longText: (d['Long text'] ?? '') as string,
                detectionMethod: (d['Detection method (D2)'] ?? '') as string,
                F1: (d['Failure mode (F1)'] ?? '') as string,
                F2: (d['Failure mode (F2)'] ?? '') as string,
                failureType: (d['Failure type'] ?? '').toUpperCase() as string,
                numberOfTests: (d['No. Of tests (in period)'] ?? NaN) as number,
              } as Form
              setNotifications((notifications) => [...notifications, d])
            })

            resolve(notifications)
          }
        }

        fileReader.onerror = (error) => {
          setNotifications([])
          reject(error)
        }
      }
    )

    promise.then(() => {
      //setNotifications(d)
    })
  }

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

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }

    await post('/notifications/', form)
  }

  const updateMultipleNotifications = () => {
    notifications.map((notification) => updateData(notification))
  }

  if (pageState === 1) {
    return (
      <div className={styles.container}>
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
              readExcel(file)
              setPage(2)
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
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
                numberOfTests: null,
              })
              setPage(3)
            }}
          />
        </div>
      </div>
    )
  } else if (pageState === 2) {
    return (
      <div className={styles.notificationcontainer}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setNotifications([])
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.center}>
          <Title title={'Preview'} />
        </div>
        <div className={styles.previewpagebuttoncontainer}>
          {valid_notifications() && (
            <Button
              label="Save"
              size="small"
              onClick={() => {
                updateMultipleNotifications()
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
        {notifications?.map((notification, key) => (
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
            <label className={styles.fontSize}>
              {notification.detectionMethod}
            </label>
            <label className={styles.fontSize}>{notification.F1}</label>
            <label className={styles.fontSize}>{notification.F2}</label>
            <label className={styles.fontSize}>
              {notification.failureType}
            </label>
            <label className={styles.fontSize}>
              {notification.numberOfTests}
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
          <InputField
            variant="standard"
            type="number"
            label="number of tests"
            placeholder={
              dataState.numberOfTests ? undefined : 'Set a number of tests...'
            }
            value={dataState.numberOfTests ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, numberOfTests: Number(value as string) })
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
                setPage(4)
                updateData(dataState)
              }}
              label="Add data"
            />
          </div>
        )}
      </div>
    )
  } else if (pageState === 4) {
    return (
      <div className={styles.container}>
        <Title title={'Add notification'} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {'Notification successfully added!'}
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
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
                numberOfTests: null,
              })
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
                detectionMethod: null,
                F1: null,
                F2: null,
                failureType: null,
                numberOfTests: null,
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
