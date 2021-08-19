import styles from './PeriodPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { IPeriod } from '../../models/period'
import Loader from 'react-loader-spinner'

export const PeriodPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const [periods, setPeriods] = useState<IPeriod[]>([])
  const history = useHistory()

  const {
    get: periodGet,
    response: periodResponse,
    loading: periodLoad,
    del: periodDel,
  } = useFetch<APIResponse<IPeriod>>('/periods', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getPeriods = async () => {
      const dataRequest = `?company=${userContext.user?.companyName}`
      const periodData: APIResponse<IPeriod[]> = await periodGet(dataRequest)
      if (periodResponse.ok) {
        setPeriods(periodData.data)
      }
    }
    getPeriods()
  }, [periodGet, periodResponse, userContext.user])

  const getPeriods = async () => {
    const dataRequest = `?company=${userContext.user?.companyName}`
    const periodData: APIResponse<IPeriod[]> = await periodGet(dataRequest)
    if (periodResponse.ok) {
      setPeriods(periodData.data)
    }
  }

  const deletePeriod = async (period: string) => {
    await periodDel(period)
    if (periodResponse.ok) {
      getPeriods()
    }
  }

  return periodLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div
        className={styles.back}
        onClick={() => history.push(MAIN_ROUTES.NOTIFICATIONS)}
      >
        {'< Back'}
      </div>
      <div className={styles.center}>
        <Title title="Periods" />
      </div>
      <div className={styles.periodcontainer}>
        <div className={styles.table}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td>{'Tag'}</td>
                  <td>{'Start Date'}</td>
                  <td>{'End date'}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          {periods?.map((data, key) => (
            <RegisteredDataField key={key}>
              <label className={styles.fontSize}>{data.tag}</label>
              <label className={styles.fontSize}>
                {new Date(data.startDate as Date).toLocaleDateString()}
              </label>
              <label className={styles.fontSize}>
                {new Date(data.endDate as Date).toLocaleDateString()}
              </label>
              <i
                onClick={() => deletePeriod(data._id)}
                className={'material-icons ' + styles.icon}
              >
                {'delete'}
              </i>
            </RegisteredDataField>
          ))}
        </div>
      </div>
    </div>
  )
}
