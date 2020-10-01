import React, { useState } from 'react'
import styles from './ChooseFacility.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/searchField'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

export interface ChooseFacilityProps {
  onChange: (value: string) => void
  getFacilities: () => Array<string>
  getComponents: () => Array<string>
  updateData: () => void
}

export interface Form {
  facility: string | null
  component: string | null
  period: number | null
  t: number | null
  du: number | null
  populationsize: number | null
}

export const ChooseFacility: React.FC<ChooseFacilityProps> = ({
  onChange,
  updateData,
  getFacilities,
  getComponents,
}: ChooseFacilityProps) => {
  const [pageState, setPage] = useState<number>(1)
  const [dataState, setData] = useState<Form>({
    facility: null,
    component: null,
    period: null,
    t: null,
    du: null,
    populationsize: null,
  })
  //const navigateToFacility: () => setData(1);
  if (pageState === 1) {
    return (
      <div className={[styles.container, styles.title].join(' ')}>
        <Title title="Choose Facility" />
        <SearchField
          label="Facility"
          variant="secondary"
          placeholder="Choose facility to register data to..."
          suggestions={getFacilities()}
          onValueChanged={(value) => onChange(value)}
          onClick={(facility) => {
            setData({ ...dataState, facility: facility })
            setPage(2)
          }}
        />
      </div>
    )
  }
  if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title={'Add failure data at'} dynamic={dataState.facility} />
        <div className={styles.data}>
          <SearchField
            variant="secondary"
            label="Component"
            placeholder={dataState.component ? undefined : 'Set a component...'}
            suggestions={getComponents()}
            onValueChanged={(value) => {
              onChange(value)
            }}
            onClick={(component) =>
              setData({ ...dataState, component: component })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Period"
            placeholder={
              dataState.period ? undefined : 'dd.mm.yyyy - dd.mm.yyyy...'
            }
            onValueChanged={(value) => {
              setData({ ...dataState, period: value as number })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="T"
            placeholder={dataState.t ? undefined : 'Set a time T in hours...'}
            onValueChanged={(value) => {
              setData({ ...dataState, t: value as number })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="DU value"
            placeholder={dataState.du ? undefined : 'Set a DU-value...'}
            onValueChanged={(value) => {
              setData({ ...dataState, du: value as number })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="Population size"
            placeholder={
              dataState.populationsize ? undefined : 'Set a populationsize...'
            }
            onValueChanged={(value) => {
              setData({ ...dataState, populationsize: value as number })
            }}
          />
        </div>
        {
          //dataState.component &&
          dataState.period &&
            dataState.t &&
            dataState.du &&
            dataState.populationsize && (
              <div className={styles.button}>
                <Button
                  onClick={() => {
                    setPage(3)
                    updateData()
                  }}
                  label="Add data"
                />
              </div>
            )
        }
      </div>
    )
  } else if (pageState === 3) {
    return (
      <div className={styles.container}>
        <Title title={'Failure data at'} dynamic={dataState.facility} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {'Data successfully added!'}
          {
            //want onClick to take function navigate as argument - setPage(1)
          }
          <Button onClick={updateData} label={'Add more data'} />
          <Button onClick={updateData} label={'View at company page'} />
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
