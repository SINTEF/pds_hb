import React, { useState } from 'react'
import styles from './ChooseFacility.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/searchField'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

export interface ChooseFacilityProps {
  onChange: (value: string) => void
  getFacilities: () => void
  getComponents: () => void
  setNewValue: () => void
  updateData: () => void
}

export interface Form {
  facility: string
  component: string
  period: string
  t: number
  du: number
  populationsize: number
}

export const ChooseFacility: React.FC<ChooseFacilityProps> = ({
  onChange,
  updateData,
  getFacilities,
  getComponents,
  setNewValue,
}: ChooseFacilityProps) => {
  const [pageState, setPage] = useState<number>(1)
  const [formState, setForm] = useState<Form>({
    facility: '',
    component: '',
    period: '',
    t: 0,
    du: 0,
    populationsize: 0,
  })
  if (pageState === 1) {
    return (
      <div className={[styles.container, styles.title].join(' ')}>
        <Title title="Choose Facility" />
        <SearchField
          label="Facility"
          variant="secondary"
          placeholder="Choose facility to register data to..."
          suggestions={() => getFacilities()}
          onValueChanged={(value) => {
            onChange(value)
            setForm({ ...formState, facility: value })
            setPage(2)
          }}
        />
      </div>
    )
  } else if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title={'Failure data at'} dynamic={formState.facility} />
        <SearchField
          variant="secondary"
          label="Component"
          placeholder={formState.component ? undefined : 'Set a component...'}
          suggestions={getComponents}
          onValueChanged={(value) => {
            onChange(value)
            setForm({ ...formState, component: value })
          }}
          onClick={}
        />
        <InputField
          variant="standard"
          type="text"
          label="Period"
          placeholder={
            formState.period ? undefined : 'dd.mm.yyyy - dd.mm.yyyy...'
          }
          onValueChanged={(value) => {
            setNewValue()
            setForm({ ...formState, period: value })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="T"
          placeholder={formState.T ? undefined : 'Set a time T in hours...'}
          onValueChanged={(value) => {
            setNewValue()
            setForm({ ...formState, t: value })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="DU value"
          placeholder={formState.du ? undefined : 'Set a DU-value...'}
          onValueChanged={(value) => {
            setNewValue()
            setForm({ ...formState, du: value })
          }}
        />
        <InputField
          variant="standard"
          type="number"
          label="Population size"
          placeholder={
            formState.populationsize ? undefined : 'Set a populationsize...'
          }
          onValueChanged={(value) => {
            setNewValue()
            setForm({ ...formState, populationsize: value })
          }}
        />
        <div className={styles.button}>
          <Button
            onClick={() => {
              updateData()
              setPage(2)
            }}
            label="Add data"
          />
        </div>
      </div>
    )
  } else if (pageState === 3) {
    return (
      <div className={styles.container}>
        <Title title={'Failure data at'} dynamic={formState.facility} />
        <Button onClick={updateData} label={'Add more data'} />
        <Button onClick={updateData} label={'View at company page'} />
      </div>
    )
  }
}
