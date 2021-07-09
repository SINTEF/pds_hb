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
  const [viewRepeating, setViewRepeating] = useState<boolean>(false)
  const [commonFailures, setcommonFailures] = useState<string[]>([])
  const [repeatingFailures, setRepeatingFailures] = useState<string[]>([])
  const [periods, setPeriods] = useState<IPeriod[]>([])
  const [notificationGroups, setNotificationGroups] = useState<
    INotificationGroup[]
  >([])
  const [failureModes, setFailureModes] = useState<string[]>([])
  const [onlyQa, setOnlyQa] = useState<boolean>(false)

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
    setcommonFailures(
      Object.entries(relevantNotifications)
        .filter(
          (notification) =>
            notification[1].commonFailure !== undefined &&
            notification[1].commonFailure !== null
        )
        .map((notification) => notification[1].commonFailure)
        .filter((v, i, a) => a.indexOf(v) === i) as string[]
    )

    setRepeatingFailures(
      Object.entries(relevantNotifications)
        .filter(
          (notification) =>
            notification[1].repeatingFailure !== undefined &&
            notification[1].repeatingFailure !== null
        )
        .map((notification) => notification[1].repeatingFailure)
        .filter((v, i, a) => a.indexOf(v) === i) as string[]
    )

    setFailureModes(
      Object.entries(relevantNotifications)
        .map((notification) =>
          notification[1].F2 ? notification[1].F2 : 'undefined'
        )
        .filter((v, i, a) => a.indexOf(v) === i)
    )
  }, [equipmentGroup])

  useEffect(() => {
    setView(
      notifications.filter(
        (notification) =>
          (notification.equipmentGroupL2 as string) === equipmentGroup &&
          (!onlyQa || notification.qualityStatus === true) &&
          new Date(notification.detectionDate).getTime() <=
            new Date(periodEnd).getTime() &&
          new Date(notification.detectionDate).getTime() >=
            new Date(periodStart).getTime()
      )
    )
  }, [equipmentGroup, periodStart, periodEnd, onlyQa])

  const getCommon = () => {
    return viewedNotifications.filter(
      (notification) =>
        notification.commonFailure !== undefined &&
        notification.commonFailure !== null
    )
  }

  const getRepeating = () => {
    return viewedNotifications.filter(
      (notification) =>
        notification.repeatingFailure !== undefined &&
        notification.repeatingFailure !== null
    )
  }

  const getNotInCommon = () => {
    return viewedNotifications.filter(
      (notification) =>
        notification.commonFailure === undefined ||
        notification.commonFailure === null
    )
  }

  const getNotInGroup = () => {
    if (viewRepeating && viewCommon) {
      return viewedNotifications.filter(
        (notification) =>
          (notification.commonFailure === undefined ||
            notification.commonFailure === null) &&
          (notification.repeatingFailure === undefined ||
            notification.repeatingFailure === null)
      )
    } else if (viewCommon) {
      return viewedNotifications.filter(
        (notification) =>
          notification.commonFailure === undefined ||
          notification.commonFailure === null
      )
    } else if (viewRepeating) {
      return viewedNotifications.filter(
        (notification) =>
          notification.repeatingFailure === undefined ||
          notification.repeatingFailure === null
      )
    } else {
      return []
    }
  }

  const calculateTotalDu = () => {
    if (viewRepeating && viewCommon) {
      return (
        repeatingFailures.length +
        commonFailures.length +
        getNotInGroup().length
      )
    } else if (viewCommon) {
      return commonFailures.length + getNotInGroup().length
    } else if (viewRepeating) {
      return repeatingFailures.length + getNotInGroup().length
    } else if (viewRepeating && viewCommon) {
      return (
        repeatingFailures.length +
        commonFailures.length +
        getNotInGroup().length
      )
    } else {
      return viewedNotifications.length
    }
  }

  const calculateBeta3 = () => {
    const failureNumbers = commonFailures.map(
      (error) =>
        viewedNotifications.filter(
          (notification) => notification.commonFailure === error
        ).length as number
    )
    const top = failureNumbers
      .map((number) => (number - 1) * number)
      .reduce((a, b) => a + b, 0)
    const bottom =
      (Math.max(...failureNumbers) - 1) * viewedNotifications.length
    return (top / bottom).toPrecision(2)
  }

  const calculateBeta2 = () => {
    const top = commonFailures.length * 2
    const bottom = getNotInCommon().length + top
    return (top / bottom).toPrecision(2)
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

  const failurePercentage = (failureMode: string) => {
    const notInGroupLength = getNotInGroup().filter(
      (notification) => notification.F2 === failureMode
    ).length
    const relevantGroups = notificationGroups.filter(
      (notificationGroup) => notificationGroup.failureMode === failureMode
    )

    if (viewCommon && viewRepeating) {
      const total =
        relevantGroups.filter((group) => commonFailures.includes(group.name))
          .length +
        relevantGroups.filter((group) => repeatingFailures.includes(group.name))
          .length +
        notInGroupLength
      return ((100 * total) / calculateTotalDu()).toFixed(1)
    } else if (viewCommon) {
      const total =
        relevantGroups.filter((group) => commonFailures.includes(group.name))
          .length + notInGroupLength
      return ((100 * total) / calculateTotalDu()).toFixed(1)
    } else if (viewRepeating) {
      const total =
        relevantGroups.filter((group) => repeatingFailures.includes(group.name))
          .length + notInGroupLength
      return ((100 * total) / calculateTotalDu()).toFixed(1)
    } else {
      const total = viewedNotifications.filter(
        (notification) => notification.F2 === failureMode
      ).length
      return ((100 * total) / calculateTotalDu()).toFixed(1)
    }

    //return (100*viewedNotifications.filter((notification)=> notification.F2 === failureMode).length/calculateTotalDu()).toFixed(1)
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
              <div className={styles.statisticsText}>{'Number of units:'}</div>
              <div className={styles.statisticsNumber}>{totalEquipments()}</div>
              <div className={styles.statisticsText}>
                {'Aggregated operation time in 10^6 hours:'}
              </div>
              <div className={styles.statisticsNumber}>
                {calculateAggregatedOperationTime().toPrecision(4)}
              </div>
            </div>
            <div className={styles.statisticsContainer}>
              {calculateAggregatedOperationTime() > 0 ? (
                <div className={styles.statisticsText}>
                  {'Failure rate (per 10^6 hours): '}
                </div>
              ) : null}
              {calculateAggregatedOperationTime() > 0 ? (
                <div className={styles.statisticsNumber}>
                  {calculateFailureRate()}
                </div>
              ) : null}
              {failureModes.map((failureMode, key) => (
                <div key={key} className={styles.statisticsContainer}>
                  <div className={styles.statisticsText}>
                    {failureMode + ':'}
                  </div>
                  <div className={styles.statisticsNumber}>
                    {failurePercentage(failureMode) + '%'}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.statisticsContainer}>
              {viewCommon ? (
                <div className={styles.statisticsText}>{'β1-value:'}</div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsNumber}>
                  {(
                    (viewedNotifications.length - getNotInCommon().length) /
                    viewedNotifications.length
                  ).toPrecision(2)}
                </div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsText}>{'β2-value:'}</div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsNumber}>
                  {calculateBeta2()}
                </div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsText}>{'β3-value:'}</div>
              ) : null}
              {viewCommon ? (
                <div className={styles.statisticsNumber}>
                  {calculateBeta3()}
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
                checked={onlyQa}
                disabled={false}
                handleChange={() => setOnlyQa(!onlyQa)}
                color="green"
              />
              <div className={styles.description}>Only quality assured</div>
            </div>
            <div className={styles.infoContainer}>
              <Switch
                checked={viewCommon}
                disabled={false}
                handleChange={() => setViewCommon(!viewCommon)}
              />
              <div className={styles.description}>
                Group common cause failures
              </div>
            </div>
            <div className={styles.infoContainer}>
              <Switch
                checked={viewRepeating}
                disabled={false}
                handleChange={() => setViewRepeating(!viewRepeating)}
                color="red"
              />
              <div className={styles.description}>Group repeating failures</div>
            </div>
          </div>
          <div className={styles.notificationscontainer}>
            <div>
              {viewCommon || viewRepeating ? (
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
                            <td>{'QA?'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {getNotInGroup().map((data, key) => (
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
                      {data.qualityStatus ? (
                        <i className={'material-icons ' + styles.checkedicon}>
                          {'check'}
                        </i>
                      ) : (
                        <i
                          className={'material-icons ' + styles.notcheckedicon}
                        >
                          {'clear'}
                        </i>
                      )}
                    </RegisteredDataField>
                  ))}
                  {viewCommon ? (
                    <div>
                      {commonFailures?.map((data, key) => (
                        <div
                          className={[styles.common, styles.commonColor].join(
                            ' '
                          )}
                          key={key}
                        >
                          <div className={styles.commonFailureName}>{data}</div>
                          <div className={styles.commondescription}>
                            {notificationGroups
                              .filter((group) => group.name === data)
                              .map((group) => group.description)}
                          </div>
                          {getCommon()
                            .filter(
                              (notification) =>
                                notification.commonFailure === data
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
                                <label className={styles.fontSize}>
                                  {data.F1}
                                </label>
                                <label className={styles.fontSize}>
                                  {data.F2}
                                </label>
                                <label className={styles.fontSize}>
                                  {data.failureType}
                                </label>
                                {data.qualityStatus ? (
                                  <i
                                    className={
                                      'material-icons ' + styles.checkedicon
                                    }
                                  >
                                    {'check'}
                                  </i>
                                ) : (
                                  <i
                                    className={
                                      'material-icons ' + styles.notcheckedicon
                                    }
                                  >
                                    {'clear'}
                                  </i>
                                )}
                              </RegisteredDataField>
                            ))}
                        </div>
                      ))}
                      <div className={styles.commonbutton}>
                        <Button
                          label={'Add or edit common cause group'}
                          size="small"
                          onClick={() =>
                            history.push(MAIN_ROUTES.ADD_COMMON_CAUSE_FAILURE)
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                  {viewRepeating ? (
                    <div>
                      {repeatingFailures?.map((data, key) => (
                        <div
                          className={[
                            styles.common,
                            styles.repeatingColor,
                          ].join(' ')}
                          key={key}
                        >
                          <div className={styles.commonFailureName}>{data}</div>
                          <div className={styles.commondescription}>
                            {notificationGroups
                              .filter((group) => group.name === data)
                              .map((group) => group.description)}
                          </div>
                          {getRepeating()
                            .filter(
                              (notification) =>
                                notification.repeatingFailure === data
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
                                <label className={styles.fontSize}>
                                  {data.F1}
                                </label>
                                <label className={styles.fontSize}>
                                  {data.F2}
                                </label>
                                <label className={styles.fontSize}>
                                  {data.failureType}
                                </label>
                                {data.qualityStatus ? (
                                  <i
                                    className={
                                      'material-icons ' + styles.checkedicon
                                    }
                                  >
                                    {'check'}
                                  </i>
                                ) : (
                                  <i
                                    className={
                                      'material-icons ' + styles.notcheckedicon
                                    }
                                  >
                                    {'clear'}
                                  </i>
                                )}
                              </RegisteredDataField>
                            ))}
                        </div>
                      ))}
                      <div className={styles.commonbutton}>
                        <Button
                          label={'Add or edit repeating failure group'}
                          size="small"
                          onClick={() =>
                            history.push(MAIN_ROUTES.ADD_REPEATING_FAILURE)
                          }
                        />
                      </div>
                    </div>
                  ) : null}
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
                            <td>{'QA?'}</td>
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
                      {data.qualityStatus ? (
                        <i className={'material-icons ' + styles.checkedicon}>
                          {'check'}
                        </i>
                      ) : (
                        <i
                          className={'material-icons ' + styles.notcheckedicon}
                        >
                          {'clear'}
                        </i>
                      )}
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
