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
  testInterval: number | null
  numberOfTests: number | null
}

export const AddNotificationsPage: React.FC = () => {
  const history = useHistory()
  const { post } = useFetch()

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
    testInterval: null,
    numberOfTests: null,
  })

  const valid_notification = () => {
    return (
      dataState.notificationNumber && dataState.detectionDate && dataState.tag
    )
  }

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }

    await post('/notifications/', form)
  }

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title={'Add notification'} />
        <div className={styles.data}>
          <InputField
            variant="standard"
            type="text"
            label="notification number"
            placeholder={
              dataState.notificationNumber ? undefined : 'Provide a comment...'
            }
            value={dataState.notificationNumber ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, notificationNumber: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="date"
            label="date"
            placeholder={dataState.detectionDate ? undefined : 'dd-mm-yyyy...'}
            value={dataState.detectionDate}
            onValueChanged={(value) => {
              setData({ ...dataState, detectionDate: value as Date })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="equipment group L2"
            placeholder={
              dataState.equipmentGroupL2 ? undefined : 'Provide a comment...'
            }
            value={dataState.equipmentGroupL2 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, equipmentGroupL2: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="tag"
            placeholder={dataState.tag ? undefined : 'Provide a comment...'}
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
              dataState.shortText ? undefined : 'Provide a comment...'
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
              dataState.longText ? undefined : 'Provide a comment...'
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
              dataState.detectionMethod ? undefined : 'Provide a comment...'
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
            placeholder={dataState.F1 ? undefined : 'Provide a comment...'}
            value={dataState.F1 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, F1: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="failure mode (F2)"
            placeholder={dataState.F2 ? undefined : 'Provide a comment...'}
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
              dataState.failureType ? undefined : 'Provide a comment...'
            }
            value={dataState.failureType ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, failureType: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="test interval"
            placeholder={
              dataState.testInterval ? undefined : 'Set a DU-value...'
            }
            value={dataState.testInterval ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, testInterval: Number(value as string) })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="number of tests"
            placeholder={
              dataState.numberOfTests ? undefined : 'Set a DU-value...'
            }
            value={dataState.numberOfTests ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, numberOfTests: Number(value as string) })
            }}
          />
        </div>
        {valid_notification() && (
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
        <Title title={'Add notification'} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {'Data successfully added!'}
          <Button
            label={'Add more data'}
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
                testInterval: null,
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
                testInterval: null,
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
