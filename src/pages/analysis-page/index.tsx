import styles from './AnalysisPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import useFetch, { CachePolicies } from 'use-http'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { INotification } from '../../models/notification'
import { ViewLongText } from '../../components/view-long-text'
import Loader from 'react-loader-spinner'
import { SearchField } from '../../components/search-field'
import { InputField } from '../../components/input-field'
import { Switch } from '../../components/switch'
import { IInventoryInstance } from '../../models/inventoryinstance'

export const AnalysisPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

  const [notifications, setNotifications] = useState<INotification[]>([])
  const [viewedNotifications, setView] = useState<INotification[]>([])
  const [equipmentGroup, setEquipmentGroup] = useState<string>()
  const [equipmentGroups, setEquipmentGroups] = useState<string[]>([])
  const [periodStart, setStart] = useState<Date>(new Date())
  const [periodEnd, setEnd] = useState<Date>(new Date())
  const [inventory, setInventory] = useState<IInventoryInstance[]>([])
  const [viewCommon, setViewCommon] = useState<boolean>(false)
  const [commonErrors, setCommonErrors] = useState<string[]>([])

  const {
    get: inventoryInstanceGet,
    response: inventoryInstanceResponse,
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
        setInventory(inventoryData.data)
      }
    }
    getInventory()
  }, [inventoryInstanceGet, inventoryInstanceResponse, userContext.user])

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
      const dataRequest = `/?company=${userContext.user?.companyName}&failureType=DU`
      const notificationData: APIResponse<
        INotification[]
      > = await notificationGet(dataRequest)
      if (notificationResponse.ok) {
        setNotifications(notificationData.data)
        setView(notificationData.data)
        setEquipmentGroups(
          notificationData.data
            .map((notification) => notification.equipmentGroupL2)
            .filter((v, i, a) => a.indexOf(v) === i)
        )
      }
    }
    getNotifications()
  }, [notificationGet, notificationResponse, userContext.user])

  useEffect(() => {
    const relevantNotifications = notifications.filter(
      (notification) =>
        (notification.equipmentGroupL2 as string) === equipmentGroup
    )

    setStart(
      new Date(
        Math.min(
          ...relevantNotifications.map(
            (notification) => new Date(notification.detectionDate).getTime() - 1
          )
        )
      )
    )
    setEnd(
      new Date(
        Math.max(
          ...relevantNotifications.map(
            (notification) => new Date(notification.detectionDate).getTime() + 1
          )
        )
      )
    )
    setCommonErrors(
      Object.entries(relevantNotifications)
        .filter((notification) => notification[1].commonError !== undefined)
        .map((not) => not[1].commonError)
        .filter((v, i, a) => a.indexOf(v) === i) as string[]
    )
  }, [equipmentGroup])

  useEffect(() => {
    setView(
      notifications.filter(
        (notification) =>
          (notification.equipmentGroupL2 as string) === equipmentGroup &&
          new Date(notification.detectionDate).getTime() <=
            new Date(periodEnd).getTime() &&
          new Date(notification.detectionDate).getTime() >=
            new Date(periodStart).getTime()
      )
    )
  }, [equipmentGroup, periodStart, periodEnd])

  const getCommon = () => {
    return viewedNotifications.filter(
      (notification) => notification.commonError !== undefined
    )
  }

  const getNotInCommon = () => {
    return viewedNotifications.filter(
      (notification) => notification.commonError == undefined
    )
  }

  const calculateTotalDu = () => {
    if (viewCommon) {
      return commonErrors.length + getNotInCommon().length
    } else {
      return viewedNotifications.length
    }
  }

  const unique = () => {
    const relevantInventory = inventory.filter(
      (inventoryInstance) =>
        (inventoryInstance.equipmentGroupL2 as string).toLowerCase() ===
        equipmentGroup?.toLowerCase()
    )

    return relevantInventory
      .map((item) => item.tag)
      .filter((value, index, self) => self.indexOf(value) === index).length
  }

  const calculateFailureRate = () => {
    const time =
      (new Date(periodEnd).getTime() - new Date(periodStart).getTime()) /
      (36e5 * 24 * 365)
    return (viewedNotifications.length / (time * unique())).toPrecision(5)
  }

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        {equipmentGroup ? (
          <div className={styles.center}>
            <Title title={`Analysis of:`} dynamic={equipmentGroup} />
            <div className={styles.statisticsContainer}>
              <div className={styles.statisticsText}>
                {'Total DU errors for selected data:'}
              </div>
              <div className={styles.statisticsNumber}>
                {calculateTotalDu()}
              </div>
              {unique() > 0 ? (
                <div className={styles.statisticsText}>
                  {'Failure rate in selected period: '}
                </div>
              ) : null}
              {unique() > 0 ? (
                <div className={styles.statisticsNumber}>
                  {calculateFailureRate()}
                </div>
              ) : null}
            </div>
            <div className={styles.infoContainer}>
              <Switch
                checked={viewCommon}
                disabled={false}
                handleChange={() => setViewCommon(!viewCommon)}
              />
              <div className={styles.description}>
                Group common cause notifications
              </div>
            </div>
          </div>
        ) : (
          <Title title={`Select equipment group`} />
        )}
        <div className={styles.searchfield}>
          <SearchField
            label="Choose equipment group"
            icon={'search'}
            placeholder="Search for equipment group..."
            variant="secondary"
            suggestions={equipmentGroups}
            onValueChanged={() => false}
            onClick={(eqGroup) => setEquipmentGroup(eqGroup)}
          />
        </div>
      </div>
      {equipmentGroup ? (
        <div>
          <div className={styles.menucontainer}>
            <InputField
              variant="primary"
              type="date"
              label="Select start date"
              value={periodStart}
              onValueChanged={(value) => {
                setStart(value as Date)
              }}
            />
            <InputField
              variant="primary"
              type="date"
              label="Select end date"
              value={periodEnd}
              onValueChanged={(value) => {
                setEnd(value as Date)
              }}
            />
          </div>
          <div className={styles.notificationscontainer}>
            <div>
              {viewCommon ? (
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
                            <td> {'Number of tests'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {getNotInCommon().map((data, key) => (
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
                      <label className={styles.fontSize}>
                        {data.numberOfTests}
                      </label>
                    </RegisteredDataField>
                  ))}
                  {commonErrors?.map((data, key) => (
                    <div className={styles.common} key={key}>
                      <div className={styles.commonErrorName}>{data}</div>
                      {getCommon()
                        .filter(
                          (notification) => notification.commonError === data
                        )
                        .map((data, key) => (
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
                            <label className={styles.fontSize}>
                              {data.tag}
                            </label>
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
                            <label className={styles.fontSize}>
                              {data.numberOfTests}
                            </label>
                          </RegisteredDataField>
                        ))}
                    </div>
                  ))}
                </div>
              ) : (
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
                            <td> {'Number of tests'}</td>
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
                      <label className={styles.fontSize}>
                        {data.numberOfTests}
                      </label>
                    </RegisteredDataField>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
