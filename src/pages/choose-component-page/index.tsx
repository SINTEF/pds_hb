import React, { useState, useEffect, FC, useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './ChooseComponentPage.module.css'
import { SUB_ROUTES } from '../../routes/routes.constants'

import { Title } from '../../components/title'

import { Group } from '../../components/group'
import useFetch, { CachePolicies } from 'use-http'
import { APIResponse } from '../../models/api-response'
import { UserContext } from '../../utils/context/userContext'
import { IInventoryInstance } from '../../models/inventoryinstance'
import Loader from 'react-loader-spinner'

export const ChooseComponentPage: FC = () => {
  const history = useHistory()
  const { url } = useRouteMatch()

  const userContext = useContext(UserContext)

  const [equipmentGroups, setEquipmentGroups] = useState<string[]>([])

  const {
    get: inventoryGet,
    response: inventoryResponse,
    loading: inventoryLoad,
  } = useFetch<APIResponse<IInventoryInstance[]>>(
    '/inventoryInstances/anonymized',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const loadInventory = async () => {
      const inventoryInstances: APIResponse<
        IInventoryInstance[]
      > = await inventoryGet()
      if (inventoryResponse.ok) {
        setEquipmentGroups(
          inventoryInstances.data
            .map((inventoryInstance) => inventoryInstance.equipmentGroupL2)
            .filter((v, i, a) => a.indexOf(v) === i)
        )
      }
    }
    loadInventory()
  }, [inventoryGet, inventoryResponse])

  return inventoryLoad || !userContext ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title title="Choose equipment group" />
      </div>
      <div className={styles.components}>
        {equipmentGroups.length > 0
          ? equipmentGroups.map((component, index) => {
              return (
                <div key={index} className={styles.equipmentContainer}>
                  <Group
                    group={component}
                    onClick={() =>
                      history.push(
                        url +
                          SUB_ROUTES.VIEW.replace(':componentName', component)
                      )
                    }
                  ></Group>
                </div>
              )
            })
          : null}
      </div>
    </div>
  )
}
