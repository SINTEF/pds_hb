import React, { useContext, useState } from 'react'
import styles from './AddDataPage.module.css'
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
  facility: string | null
  component: string | null
  startDate: Date
  endDate: Date
  du: number | null
  populationSize: number | null
  failureRate: number | null
  T: number | null
  status: string
}

export const AddDataPage: React.FC = () => {
  const history = useHistory()
  const { post, response } = useFetch()

  const userContext = useContext(UserContext) as IUserContext

  const [dataState, setData] = useState<Form>({
    component: null,
    startDate: new Date(),
    endDate: new Date(),
    du: null,
    populationSize: null,
    company: undefined,
    facility: null,
    failureRate: null,
    T: null,
    status: 'new',
  })

  const valid_datainstance = () => {
    return (
      dataState.component &&
      dataState.startDate &&
      dataState.endDate &&
      dataState.du &&
      dataState.populationSize &&
      dataState.facility &&
      dataState.T &&
      dataState.failureRate
    )
  }

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }
    await post('/data-instances/', form)
    if (response.ok) {
      history.push(MAIN_ROUTES.SEE_ALL_EDITS)
    }
  }

  return (
    <div className={styles.container}>
      <Title title={'Add failure data'} />
      <div className={styles.data}>
        <InputField
          variant="standard"
          type="text"
          label="Component"
          placeholder={dataState.component ? undefined : 'Choose component...'}
          value={dataState.component ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, component: value as string })
          }}
        />
        <InputField
          variant="standard"
          type="text"
          label="Source"
          placeholder={dataState.facility ? undefined : 'Provide a source...'}
          value={dataState.facility ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, facility: value as string })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="DU value"
          placeholder={dataState.du ? undefined : 'Set a DU-value...'}
          value={dataState.du ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, du: Number(value as string) })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="T (in 10^6 hours)"
          placeholder={dataState.T ? undefined : 'Set T...'}
          value={dataState.T ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, T: Number(value as string) })
          }}
        />
        <InputField
          variant="standard"
          type="date"
          label="Start period"
          placeholder={dataState.startDate ? undefined : 'dd-mm-yyyy...'}
          value={dataState.startDate}
          onValueChanged={(value) => {
            setData({ ...dataState, startDate: value as Date })
          }}
        />
        <InputField
          variant="standard"
          type="date"
          label="End period"
          placeholder={dataState.endDate ? undefined : 'dd-mm-yyyy...'}
          value={dataState.endDate}
          onValueChanged={(value) => {
            setData({ ...dataState, endDate: value as Date })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="Population size"
          placeholder={
            dataState.populationSize ? undefined : 'Set a population size...'
          }
          value={dataState.populationSize ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, populationSize: Number(value as string) })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="Failure rate (per 10^6 hours)"
          placeholder={
            dataState.failureRate ? undefined : 'Set Failure rate...'
          }
          value={dataState.failureRate ?? undefined}
          onValueChanged={(value) => {
            setData({ ...dataState, failureRate: Number(value as string) })
          }}
        />
      </div>
      {valid_datainstance() && (
        <div className={styles.button}>
          <Button
            onClick={() => {
              updateData(dataState)
            }}
            label="Add data"
          />
        </div>
      )}
    </div>
  )
}
