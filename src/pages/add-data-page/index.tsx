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
  startdate: number | null
  enddate: number | null
  du: number | null
  populationsize: number | null
  company: string | undefined
  l3: { filter: string; value: string }[] | null
}

interface componentReq {
  names: string[]
  components: IComponent[]
}

export const AddDataPage: React.FC = () => {
  const { post, get } = useFetch()

  const userContext = useContext(UserContext) as IUserContext

  const [pageState, setPage] = useState<number>(1)
  const [components, setComponents] = useState<IComponent[]>([])
  const [componentNames, setComponentNames] = useState<string[]>([])
  const [facilities, setFacilities] = useState<string[]>([])

  const [dataState, setData] = useState<Form>({
    facility: null,
    component: null,
    startdate: null,
    enddate: null,
    du: null,
    populationsize: null,
    company: undefined,
    l3: [],
  })

  useEffect(() => {
    getComponents().then((obj) => {
      const { names, components } = obj
      setComponents(components)
      setComponentNames(names)
    })
  }, [])

  useEffect(() => {
    getFacilities().then((names) => {
      setFacilities(names)
    })
  }, [userContext.user?.companyName])

  useEffect(() => {
    getL3()
  }, [])

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }
    await post('/data-instances', form)
  }

  const getComponents = async (): Promise<componentReq> => {
    const components = await get('/components')
    const componentNames = components['data'].map(
      (component: IComponent) => component.name
    )
    return { names: componentNames, components: components.data }
  }

  const getFacilities = async (): Promise<Array<string>> => {
    if (userContext.user) {
      const companies = await get(`company/${userContext.user?.companyName}`)
      return companies.data.facilities
    }
    return []
  }

  const getL3 = () => {
    if (dataState.component) {
      return components.filter(
        (component) => component.name === dataState.component
      )[0].L3
    } else {
      return []
    }
  }

  //const navigateToFacility: () => setData(1);
  if (pageState === 1) {
    return (
      <div className={styles.facilitycontainer}>
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
            suggestions={componentNames}
            onValueChanged={() => false}
            onClick={(component) =>
              setData({ ...dataState, component: component })
            }
          />
          <InputField
            variant="standard"
            type="number"
            label="Start period"
            placeholder={dataState.startdate ? undefined : 'dd.mm.yyyy...'}
            onValueChanged={(value) => {
              setData({ ...dataState, startdate: value as number })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="End period"
            placeholder={dataState.enddate ? undefined : 'dd.mm.yyyy...'}
            onValueChanged={(value) => {
              setData({ ...dataState, enddate: value as number })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="DU value"
            placeholder={dataState.du ? undefined : 'Set a DU-value...'}
            onValueChanged={(value) => {
              setData({ ...dataState, du: Number(value as string) })
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
              setData({ ...dataState, populationsize: Number(value as string) })
            }}
          />
          {Object.entries(getL3() ?? []).map(([filter, values]) => (
            <SearchField
              variant="secondary"
              label={filter}
              suggestions={values as string[]}
              placeholder={
                dataState.l3
                  ? undefined
                  : 'Choose ' + filter.replace('-', ' ') + '...'
              }
              onValueChanged={() => false}
              onClick={(value) => {
                setData({
                  ...dataState,
                  l3: [{ filter: filter, value: value }],
                })
              }}
              key={filter}
            />
          ))}
        </div>
        {
          //dataState.component &&

          dataState.startdate &&
            dataState.enddate &&
            dataState.du &&
            dataState.populationsize && (
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
          <Button
            label={'Add more data'}
            onClick={() => {
              setPage(2)
              setData({
                facility: dataState.facility,
                component: null,
                du: null,
                populationsize: null,
                company: dataState.company,
                startdate: null,
                enddate: null,
                l3: [],
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
