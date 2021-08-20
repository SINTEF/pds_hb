import React, { useState, useEffect, FC, useContext, useCallback } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './ChooseComponentPage.module.css'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'

import { Title } from '../../components/title'

import { Group } from '../../components/group'
import { IGroup } from '../../components/equipment-group-form'
import useFetch, { CachePolicies } from 'use-http'
import { IComponent } from '../../models/component'
import { APIResponse } from '../../models/api-response'
import { IModule } from '../../models/module'
import { CreateEquipmentGroup } from '../../components/create-equipment-group'
import { CreateModule } from '../../components/create-module'
import { EditEquipmentGroup } from '../../components/edit-equipment-group'
import { EditModule } from '../../components/edit-module'
import { Button } from '../../components/button'
import { UserContext } from '../../utils/context/userContext'

export const ChooseComponentPage: FC = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [pageState, setPage] = useState<number>(1)
  const [modules, setModules] = useState<IModule[]>([])
  const [selectedModule, setSelectedModule] = useState<string>('')
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<string>(
    ''
  )
  const [equipmentGroup, setEquipmentGroup] = useState<IGroup[]>([])
  const [allComponents, setAllComponents] = useState<IComponent[]>([])

  const userContext = useContext(UserContext)

  const { get: componentGet, response: componentResponse } = useFetch<
    APIResponse<IComponent>
  >('/components', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const { get: moduleGet, response: moduleResponse } = useFetch<
    APIResponse<IModule>
  >('/modules', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const loadComponents = useCallback(async () => {
    const components = await componentGet()
    if (componentResponse.ok) setAllComponents(components.data)
  }, [componentGet, componentResponse])

  const loadModules = useCallback(async () => {
    const modules = await moduleGet()
    if (moduleResponse.ok) setModules(modules.data)
  }, [moduleGet, moduleResponse])

  const refreshData = useCallback(() => {
    loadComponents()
    loadModules()
  }, [loadComponents, loadModules])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const getEquipmentGroupComponents = (group: string) =>
    allComponents.filter(
      (component) => component.equipmentGroup === group
    ) as IGroup[]

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group" />
        {modules.map((module) => (
          <>
            <div className={styles.moduletitle}>
              <span>{module.name}</span>
              {userContext?.user?.userGroupType === 'admin' ? (
                <EditModule
                  equipmentModule={module}
                  afterSave={() => refreshData()}
                />
              ) : null}
            </div>
            <div className={styles.components} key={module.name}>
              {module.equipmentGroups.map((group, index) => (
                <>
                  <div key={index} className={styles.equipmentContainer}>
                    <Group
                      group={{ name: group, module: module.name }}
                      onClick={() => {
                        setEquipmentGroup(getEquipmentGroupComponents(group))
                        setSelectedModule(module.name)
                        setSelectedEquipmentGroup(group)
                        setPage(2)
                      }}
                    />
                    {userContext?.user?.userGroupType === 'admin' ? (
                      <EditEquipmentGroup
                        equipmentGroup={{ name: group, module: module.name }}
                        afterSave={() => refreshData()}
                      />
                    ) : null}
                  </div>
                </>
              ))}
            </div>
          </>
        ))}
        {userContext?.user?.userGroupType === 'admin' ? (
          <div className={styles.newComponentButton}>
            <CreateEquipmentGroup afterSave={() => refreshData()} />
            <CreateModule afterSave={() => refreshData()} />
          </div>
        ) : null}
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
        <span className={styles.moduletitle}>{selectedEquipmentGroup}</span>
        <div className={styles.components}>
          {equipmentGroup.length > 0 ? (
            equipmentGroup.map((component, index) => {
              return (
                <div key={index} className={styles.equipmentContainer}>
                  <Group
                    group={component}
                    onClick={() =>
                      history.push(
                        url +
                          SUB_ROUTES.VIEW.replace(
                            ':componentName',
                            component.name.replace(' ', '-')
                          )
                      )
                    }
                  ></Group>
                </div>
              )
            })
          ) : (
            <div className={styles.equipmentContainer}>
              <p>
                Looks like this equipment group doesn&apos;t have any components
                in it yet.
              </p>
              <p>You can add one using the button below</p>
            </div>
          )}
        </div>
        {userContext?.user?.userGroupType === 'admin' ? (
          <div className={styles.newComponentButton}>
            <Button
              label="Add new component"
              onClick={() =>
                history.push(
                  MAIN_ROUTES.ADD_COMPONENT.replace(
                    ':groupModule',
                    selectedModule.replace(' ', '+')
                  ).replace(
                    ':equipmentGroup',
                    selectedEquipmentGroup.replace(' ', '+')
                  )
                )
              }
            />
          </div>
        ) : null}
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
