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

export const AnalysisPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const [open, setOpen] = useState<boolean>(false)
  const [longText, setLongText] = useState<string>('')

  const [notifications, setNotifications] = useState<INotification[]>([])
  const [viewedNotifications, setView] = useState<INotification[]>([])
  const [equipmentGroup, setEquipmentGroup] = useState<string>()
  const [equipmentGroups, setEquipmentGroups] = useState<string[]>([])

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
    setView(
      notifications.filter(
        (notification) =>
          (notification.equipmentGroupL2 as string) === equipmentGroup
      )
    )
  }, [equipmentGroup])

  const calculateTotalDu = () => {
    return viewedNotifications.length
  }
  const calculateFailureRate = () => {
    return viewedNotifications.length / (10 * 10)
  }

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        {equipmentGroup ? (
          <div>
            <Title title={`Analysis of:`} dynamic={equipmentGroup} />
            <div className={styles.statisticsContainer}>
              <div className={styles.statisticsText}>
                {'Total DU errors for selected data:'}
              </div>
              <div className={styles.statisticsNumber}>
                {calculateTotalDu()}
              </div>
              <div className={styles.statisticsText}>
                {'Failure rate for selected data: '}
              </div>
              <div className={styles.statisticsNumber}>
                {calculateFailureRate()}
              </div>
            </div>
          </div>
        ) : (
          <Title title={`Select equipment group`} />
        )}
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
      {equipmentGroup ? (
        <div>
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
                      <td> {'Number of tests'}</td>
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
                    {data.numberOfTests}
                  </label>
                </RegisteredDataField>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
