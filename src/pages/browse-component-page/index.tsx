import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useFetch from 'use-http'
import { SUB_ROUTES } from '../../routes/routes.constants'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { TextBox } from '../../components/text-box'
import { EditableField } from '../../components/editable-field'
import { Filter } from '../../components/filter'
import { Table } from '../../components/table'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { IComponent } from '../../models/component'
import { IDataInstance } from '../../models/datainstance'

export interface Form {
  filters: { filter: string; value: string }[]
}

export const BrowseComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>()

  // {name: string, size: string, design: string, revisionDate: string, remarks: string,
  // description: string, updated: string, data: {}, module:  string, equipmentGroup: string,
  // filters: {måleprinsipp: [guge, beta, alfa], medium: [fejiugo, fsf ] }}
  // size and design is filters?
  const {
    get: componentGet,
    response: componentResponse,
    loading: componentLoad,
  } = useFetch('/component')

  const {
    get: datainstanceGet,
    response: datainstanceResponse,
    loading: datainstanceLoad,
  } = useFetch('/datainstance')

  useEffect(() => {
    loadComponents()
  })

  useEffect(() => {
    loadDatainstances()
  }, [])

  const loadComponents = async () => {
    const initialComp = await componentGet('/?name=' + componentName)
    if (componentResponse.ok) {
      setComp(initialComp)
      setFilter({
        filters: [{ filter: 'Component', value: compState?.name as string }],
      })
    }
    const components = await componentGet()
    if (componentResponse.ok) setComponents(components)
  }

  const loadDatainstances = async () => {
    const initialData = await datainstanceGet('/?component=' + compState)
    if (datainstanceResponse.ok) setDatainstances(initialData)
  }

  const userContext = useContext(UserContext) as IUserContext

  const [compState, setComp] = useState<IComponent>()
  const [components, setComponents] = useState<IComponent[]>()
  const [, setDatainstances] = useState<IDataInstance[]>()
  const [filterState, setFilter] = useState<Form>()
  const equipmentGroup = compState?.equipmentGroup
  const componentNames = components
    ?.filter((component) => component.equipmentGroup === equipmentGroup)
    .map((component) => component.name)
  const headers = [
    'Failure rates',
    'Source',
    'DU',
    'T',
    'Obs period',
    'Population size',
    'Comment',
  ]
  const history = useHistory()

  const getComponent = (name: string) => {
    return components?.filter((comp) => (comp.name = name))[0]
  }

  //const getFailureData = () => {
  //  return datainstances?.filter((data) =>
  //    filterState?.filters.forEach((filter, idx) => Object.keys(data.L3)[filter.filter] ? filter.value : )
  //  )
  //}

  return componentLoad ? (
    <p>loading...</p>
  ) : (
    <div>
      <div
        className={styles.path}
        onClick={() => history.push(SUB_ROUTES.CHOOSE_COMP)}
      >
        {'/Choose equipmentgroup /'}
        {compState?.equipmentGroup}
      </div>
      <div className={[styles.filters, styles.padding].join(' ')}>
        {
          // think i need a isChecked var to set/unset the filter
        }
        <Filter
          category="Component"
          filters={componentNames as string[]}
          onClick={(newcomp) => setComp(getComponent(newcomp))}
        />
        {Object.entries(compState?.L3 ?? {})
          .filter(([, filters]) => filters !== undefined)
          .map(([filterName, filters]) => (
            <Filter
              category={filterName}
              filters={filters as string[]}
              onClick={(selected) => {
                if (filterState) {
                  setFilter({
                    filters: [
                      ...filterState.filters,
                      {
                        filter: filterName,
                        value: selected,
                      },
                    ],
                  })
                } else {
                  setFilter({
                    filters: [{ filter: filterName, value: selected }],
                  })
                }
              }}
              key={filterName}
            />
          ))}
      </div>
      <div>
        <div className={styles.content}>
          <div className={[styles.padding, styles.center].join(' ')}>
            <Title title={compState?.name as string} />
          </div>
          <div className={styles.description}>
            <TextBox
              title="Description"
              content={compState?.description as string}
              size="small"
            />
          </div>
          <EditableField
            index="Date of revision"
            content={(compState?.revisionDate as unknown) as string}
            mode="view"
            isAdmin={userContext?.user?.userGroupId === 'Admin'}
          />
          <EditableField
            index="Remarks"
            content={compState?.remarks}
            mode="view"
            isAdmin={userContext?.user?.userGroupId === 'Admin'}
          />
          <EditableField
            index="Recommended values for calculation"
            content={compState?.name} //reccomended vslues not in db
            mode="view"
            isAdmin={userContext?.user?.userGroupId === 'Admin'}
          />
          <div className={styles.padding}>
            <TextBox
              title="Definition of DU"
              content={compState?.name as string} // definition of DU not in db
              size="large"
            />
          </div>
          <div className={[styles.center, styles.padding].join(' ')}>
            <Title title="Failure data" />
          </div>
          {datainstanceLoad ? (
            <p>loading...</p>
          ) : (
            <Table
              headers={headers}
              data={[
                ['0.3', 'A', '6', '2,8*10^6', '2006', '2018', '689'],
                ['0.6', 'C', '3', '3,7*10^6', '2003', '2019', '36'],
                ['0.5', 'A', '2,4*10^6', '2010', '2015', '456'],
              ]}
              onValueChanged={() => false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
