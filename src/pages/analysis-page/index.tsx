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
import { IPeriod } from '../../models/period'
import { INotificationGroup } from '../../models/notificationGroup'
import { Button } from '../../components/button'
import MAIN_ROUTES from '../../routes/routes.constants'
import { useHistory } from 'react-router-dom'

export const AnalysisPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')
  const history = useHistory()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [viewedNotifications, setView] = useState<INotification[]>([])
  const [equipmentGroup, setEquipmentGroup] = useState<string>()
  const [equipmentGroups, setEquipmentGroups] = useState<string[]>([])
  const [periodStart, setStart] = useState<Date>(new Date())
  const [periodEnd, setEnd] = useState<Date>(new Date())
  const [inventory, setInventory] = useState<IInventoryInstance[]>([])
  const [viewCommon, setViewCommon] = useState<boolean>(false)
  const [commonErrors, setCommonErrors] = useState<string[]>([])
  const [periods, setPeriods] = useState<IPeriod[]>([])
  const [notificationGroups, setNotificationGroups] = useState<
    INotificationGroup[]
  >([])

  const {
    get: notificationGroupsGet,
    response: notificationGroupsResponse,
  } = useFetch<APIResponse<INotificationGroup>>(
    '/notificationGroups',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const getNotificationGroups = async () => {
      const dataRequest = `?company=${userContext.user?.companyName}`
      const notificationGroupData: APIResponse<
        INotificationGroup[]
      > = await notificationGroupsGet(dataRequest)
      if (notificationGroupsResponse.ok) {
        setNotificationGroups(notificationGroupData.data)
      }
    }
    getNotificationGroups()
  }, [notificationGroupsGet, notificationGroupsResponse, userContext.user])

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

  const { get: periodGet, response: periodResponse } = useFetch<
    APIResponse<IPeriod>
  >('/periods', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getPeriod = async () => {
      const dataRequest = `?company=${userContext.user?.companyName}`
      const periodData: APIResponse<IPeriod[]> = await periodGet(dataRequest)
      if (periodResponse.ok) {
        setPeriods(periodData.data)
      }
    }
    getPeriod()
  }, [periodGet, periodResponse, userContext.user])

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

  const totalEquipments = () => {
    const relevantInventory = inventory.filter(
      (inventoryInstance) =>
        (inventoryInstance.equipmentGroupL2 as string).toLowerCase() ===
        equipmentGroup?.toLowerCase()
    )

    const relevantPeriods = periods.filter((period) =>
      relevantInventory
        .map((inventoryInstance) => inventoryInstance.tag)
        .includes(period.tag)
    )

    return relevantPeriods.length
  }

  const calculateAggregatedOperationTime = () => {
    const relevantInventory = inventory.filter(
      (inventoryInstance) =>
        (inventoryInstance.equipmentGroupL2 as string).toLowerCase() ===
        equipmentGroup?.toLowerCase()
    )

    const relevantPeriods = periods.filter((period) =>
      relevantInventory
        .map((inventoryInstance) => inventoryInstance.tag)
        .includes(period.tag)
    )
    const time = 36e5 * 10e6
    const startDates = relevantPeriods
      .map((period) =>
        Math.max(
          new Date(periodStart).getTime(),
          new Date(period.startDate).getTime()
        )
      )
      .reduce((a, b) => a + b, 0)
    const endDates = relevantPeriods
      .map((period) =>
        Math.min(
          new Date(periodEnd).getTime(),
          new Date(period.endDate).getTime()
        )
      )
      .reduce((a, b) => a + b, 0)
    //const time2 = 36e5 * 24 * 365 * relevantPeriods.length
    //console.log((endDates - startDates) / time2)
    return (endDates - startDates) / time
  }

  const calculateFailureRate = () => {
    return (
      calculateTotalDu() / calculateAggregatedOperationTime()
    ).toPrecision(4)
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
              <div className={styles.statisticsText}>
                {'Observation periods:'}
              </div>
              <div className={styles.statisticsNumber}>{totalEquipments()}</div>
            </div>
            <div className={styles.statisticsContainer}>
              {viewCommon ? (
                <div className={styles.statisticsText}>{'β-value:'}</div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsNumber}>
                  {(
                    (viewedNotifications.length - getNotInCommon().length) /
                    viewedNotifications.length
                  ).toPrecision(2)}
                </div>
              ) : null}
              {calculateAggregatedOperationTime() > 0 ? (
                <div className={styles.statisticsText}>
                  {'Failure rate in selected period (per 10^6 hours): '}
                </div>
              ) : null}
              {calculateAggregatedOperationTime() > 0 ? (
                <div className={styles.statisticsNumber}>
                  {calculateFailureRate()}
                </div>
              ) : null}
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
                    </RegisteredDataField>
                  ))}
                  {commonErrors?.map((data, key) => (
                    <div className={styles.common} key={key}>
                      <div className={styles.commonErrorName}>{data}</div>
                      <div className={styles.commondescription}>
                        {notificationGroups
                          .filter((group) => group.name == data)
                          .map((group) => group.description)}
                      </div>
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
                          </RegisteredDataField>
                        ))}
                    </div>
                  ))}
                  <div className={styles.commonbutton}>
                    <Button
                      label={'Add or edit common cause group'}
                      size="small"
                      onClick={() =>
                        history.push(MAIN_ROUTES.ADD_NOTIFICATION_GROUP)
                      }
                    />
                  </div>
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
