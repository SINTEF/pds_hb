import React, { useState, useEffect, FC, useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './OwnData.module.css'
import { SUB_ROUTES } from '../../routes/routes.constants'

import { Title } from '../../components/title'

import { Group } from '../../components/group'
import { IGroup } from '../../components/equipment-group-form'
import useFetch from 'use-http'
import { IComponent } from '../../models/component'
import { APIResponse } from '../../models/api-response'
import { IModule } from '../../models/module'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { IDataInstance } from '../../models/datainstance'

export const OwnDataPage: FC = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [pageState, setPage] = useState<number>(1)
  const [equipmentgroup, setEquipmentGroup] = useState<IGroup[]>([])
  const [allComponents, setAllComponents] = useState<IComponent[]>([])
  const [dataInstances, setDatainstances] = useState<IDataInstance[]>([])
  const userContext = useContext(UserContext) as IUserContext

  const { get: componentGet, response: componentResponse } = useFetch<
    APIResponse<IComponent>
  >('/components')

  const { get: moduleGet, response: moduleResponse } = useFetch<
    APIResponse<IModule>
  >('/modules')

  const { get: datainstanceGet, response: datainstanceResponse } = useFetch<
    APIResponse<IDataInstance>
  >('/data-instances/?company=' + userContext.user?.companyName)

  useEffect(() => {
    loadComponents()
  }, [])

  useEffect(() => {
    loadModules()
  }, [])

  useEffect(() => {
    loadDataInstances()
  }, [])

  const loadDataInstances = async () => {
    const dataInstances = await datainstanceGet()
    if (datainstanceResponse.ok) setDatainstances(dataInstances.data)
  }

  const loadComponents = async () => {
    const components = await componentGet()
    if (componentResponse.ok) setAllComponents(components.data)
  }

  const loadModules = async () => {
    const modules = await moduleGet()
    if (moduleResponse.ok) setModules(modules.data)
  }

  const componentNames = dataInstances.map((instance) => instance.component)

  const getEquipmentGroup = (group: string) =>
    components.filter(
      (component) => component.equipmentGroup === group
    ) as IGroup[]

  const components = allComponents.filter((component) =>
    componentNames.includes(component.name)
  )
  const equipmentGroupNames = components.map(
    (instance) => instance.equipmentGroup
  )

  const relevantEquipmentGroups = Array.from(new Set(equipmentGroupNames))

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>

        <>
          <div className={styles.components}>
            {relevantEquipmentGroups.map((group, index) => (
              <div key={index} className={styles.equipmentContainer}>
                <Group
                  isAdmin={false}
                  group={{ name: group }}
                  onClick={() => {
                    setEquipmentGroup(getEquipmentGroup(group))
                    setPage(2)
                  }}
                />
              </div>
            ))}
          </div>
        </>
      </div>
    )
  }
  if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title="Choose component"> </Title>
        <div className={styles.back} onClick={() => setPage(1)}>
          {' < Back'}
        </div>
        <div className={styles.components}>
          {equipmentgroup.map((component, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <Group
                  isAdmin={false}
                  group={component}
                  onClick={() =>
                    history.push(
                      url +
                        SUB_ROUTES.VIEW.replace(
                          ':componentName',
                          component.name.replace(' ', '+')
                        )
                    )
                  }
                ></Group>
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
