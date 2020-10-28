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
import { formatCamelCase } from '../../utils/casing'

export interface Form {
  facility: string | null
  component: string | null
  startDate: Date | null
  endDate: Date | null
  du: number | null
  populationSize: number | null
  company: string | undefined
  l3: { filter: string; value: string }[] | null
  comment: string | null
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
    startDate: null,
    endDate: null,
    du: null,
    populationSize: null,
    company: undefined,
    l3: null,
    comment: null,
  })

  const valid_datainstance = () => {
    return (
      dataState.startDate &&
      dataState.endDate &&
      dataState.du &&
      dataState.populationSize
    )
  }

  useEffect(() => {
    const getComponents = async (): Promise<componentReq> => {
      const components = await get('/components')
      const componentNames = components['data'].map(
        (component: IComponent) => component.name
      )
      return { names: componentNames, components: components.data }
    }

    getComponents().then((obj) => {
      const { names, components } = obj
      setComponents(components)
      setComponentNames(names)
    })
  }, [get])

  useEffect(() => {
    const getFacilities = async (): Promise<Array<string>> => {
      if (userContext.user) {
        const companies = await get(`company/${userContext.user?.companyName}`)
        return companies.data.facilities
      }
      return []
    }

    getFacilities().then((names) => {
      setFacilities(names)
    })
  }, [get, userContext])

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }
    //const filterReq = form.l3.
    const postReq =
      'facility=' +
      form.facility +
      '&' +
      'component=' +
      form.component +
      '&' +
      'startPeriod=' +
      form.startDate?.toDateString +
      '&' +
      'endPeriod=' +
      form.endDate?.toDateString +
      '&' +
      'du=' +
      form.du?.toString +
      '&' +
      'populationSize=' +
      form.populationSize?.toString
    await post('/data-instances/?' + postReq)
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
            placeholder={dataState.startDate ? undefined : 'yyyy-mm-dd...'}
            onValueChanged={(value) => {
              setData({ ...dataState, startDate: value as Date })
            }}
          />
          <InputField
            variant="standard"
            type="number"
            label="End period"
            placeholder={dataState.endDate ? undefined : 'yyyy-mm-dd...'}
            onValueChanged={(value) => {
              setData({ ...dataState, endDate: value as Date })
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
              dataState.populationSize ? undefined : 'Set a population size...'
            }
            onValueChanged={(value) => {
              setData({ ...dataState, populationSize: Number(value as string) })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="Comment"
            placeholder={dataState.comment ? undefined : 'Provide a comment...'}
            onValueChanged={(value) => {
              setData({ ...dataState, comment: value as string })
            }}
          />
          {Object.entries(getL3() ?? []).map(([filter, values]) => (
            <SearchField
              variant="secondary"
              label={formatCamelCase(filter)}
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
        {valid_datainstance && (
          <div className={styles.button}>
            <Button
              onClick={() => {
                setPage(3)
                updateData(dataState)
              }}
              label="Add data"
            />
          </div>
        )}
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
                populationSize: null,
                company: dataState.company,
                startDate: null,
                endDate: null,
                l3: [],
                comment: null,
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
