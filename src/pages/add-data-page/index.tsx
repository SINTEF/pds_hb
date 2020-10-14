import React, { useContext, useState, useEffect } from 'react'
import styles from './AddDataPage.module.css'
import useFetch from 'use-http'
import { Title } from '../../components/title'
import { SearchField } from '../../components/search-field'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { IComponent } from '../../models/component'

export interface Form {
  facility: string | null
  component: string | null
  T: number | null
  du: number | null
  populationsize: number | null
  company: string | undefined
}

export const AddDataPage: React.FC = () => {
  const { post, get } = useFetch()

  const userContext = useContext(UserContext) as IUserContext

  const [pageState, setPage] = useState<number>(1)
  const [components, setComponents] = useState<string[]>([])
  const [facilities, setFacilities] = useState<string[]>([])

  const [dataState, setData] = useState<Form>({
    facility: null,
    component: null,
    T: null,
    du: null,
    populationsize: null,
    company: userContext.user?.companyName,
  })

  useEffect(() => {
    getComponents().then((componentNames) => {
      setComponents(componentNames)
    })
  }, [])

  useEffect(() => {
    getFacilities().then((names) => {
      setFacilities(names)
    })
  }, [])

  const updateData = async (form: Form): Promise<void> => {
    await post('/data-instances', form)
  }

  const getComponents = async (): Promise<Array<string>> => {
    const components = await get('/components')
    const componentNames = components['data'].map(
      (component: IComponent) => component.name
    )
    return componentNames
  }

  const getFacilities = async (): Promise<Array<string>> => {
    const companies = await get(`company/${userContext.user?.companyName}`)
    return companies.data.facilities
  }
  //const navigateToFacility: () => setData(1);
  if (pageState === 1) {
    return (
      <div className={[styles.container, styles.title].join(' ')}>
        <Title title="Choose Facility" />
        <SearchField
          label="Facility"
          variant="secondary"
          placeholder="Choose facility to register data to..."
          suggestions={facilities}
          onValueChanged={() => false}
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
            suggestions={components}
            onValueChanged={() => false}
            onClick={(component) =>
              setData({ ...dataState, component: component })
            }
          />
          <InputField
            variant="standard"
            type="number"
            label="T"
            placeholder={dataState.T ? undefined : 'Set a time T in hours...'}
            onValueChanged={(value) => {
              setData({ ...dataState, T: value as number })
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

          dataState.T && dataState.du && dataState.populationsize && (
            <div className={styles.button}>
              <Button
                onClick={() => {
                  setPage(3)
                  updateData(dataState)
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
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
