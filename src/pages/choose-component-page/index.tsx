import React, { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './ChooseComponentPage.module.css'
import { SUB_ROUTES } from '../../routes/routes.constants'

import { Title } from '../../components/title'

import { Group } from '../../components/group'
import { IGroup } from '../../components/equipment-group-form'
import useFetch from 'use-http'
import { IComponent } from '../../models/component'
import { APIResponse } from '../../models/api-response'
import { IModule } from '../../models/module'

export const ChooseComponentPage: FC = () => {
  const history = useHistory()
  const [pageState, setPage] = useState<number>(1)
  const [modules, setModules] = useState<IModule[]>([])
  const [equipmentgroup, setEquipmentGroup] = useState<IGroup[]>([])
  const [allComponents, setAllComponents] = useState<IComponent[]>([])

  const { get: componentGet, response: componentResponse } = useFetch<
    APIResponse<IComponent>
  >('/component')

  const { get: moduleGet, response: moduleResponse } = useFetch<
    APIResponse<IModule>
  >('/module')

  useEffect(() => {
    loadComponents()
  }, [])

  useEffect(() => {
    loadModules()
  }, [])

  const loadComponents = async () => {
    const components = await componentGet()
    if (componentResponse.ok) setAllComponents(components)
  }

  const loadModules = async () => {
    const components = await moduleGet()
    if (moduleResponse.ok) setModules(components)
  }

  const getEquipmentGroup = (group: string) =>
    allComponents.filter(
      (component) => component.equipmentGroup === group
    ) as IGroup[]

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>
        <div className={styles.components}>
          {modules.map((module) => (
            <div key={module.name}>
              {module.name}

              {module.equipmentGroups.map((group, index) => (
                <div key={index} className={styles.equipmentContainer}>
                  <Group
                    isAdmin={false}
                    group={{ name: group }}
                    onClick={() => {
                      setPage(2)
                      setEquipmentGroup(getEquipmentGroup(group))
                    }}
                  ></Group>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>
        <div className={styles.components}>
          {equipmentgroup.map((component, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <Group
                  isAdmin={false}
                  group={component}
                  onClick={() =>
                    history.push(
                      SUB_ROUTES.VIEW + '/' + component.name.replace(' ', '+')
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
