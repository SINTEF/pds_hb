import React, { useContext, useEffect, useState } from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'
import useFetch, { CachePolicies } from 'use-http'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { APIResponse } from '../../models/api-response'
import Loader from 'react-loader-spinner'
import { IInventoryInstance } from '../../models/inventoryinstance'

export const Frontpage: React.FC = () => {
  const history = useHistory()
  const userContext = useContext(UserContext) as IUserContext
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
    <div className={styles.frontpage}>
      <div>
        <div className={styles.title}>{'PDS Datahandbook'}</div>
        {userContext.user?.userGroupType === 'general_user' ? (
          <div className={[styles.generalMenu, styles.menu].join(' ')}>
            <SearchField
              variant="primary"
              icon={'search'}
              placeholder="Search for component..."
              suggestions={equipmentGroups}
              onValueChanged={() => false}
              onClick={(componentName) =>
                history.push(
                  `${MAIN_ROUTES.BROWSE}${SUB_ROUTES.VIEW}/`.replace(
                    ':componentName',
                    componentName.replace(' ', '+')
                  )
                )
              }
            ></SearchField>
            <Button
              label={'Read PDS datahandbook'}
              onClick={() => history.push(MAIN_ROUTES.READ)}
            />
            <Button
              label={'Browse equipment data'}
              onClick={() => history.push(MAIN_ROUTES.BROWSE)}
            />
          </div>
        ) : null}
        {userContext.user?.userGroupType === 'admin' ? (
          <div className={[styles.operatorMenu, styles.menu].join(' ')}>
            {inventoryLoad && (
              <div className={styles.loading}>
                <Loader type="Grid" color="grey" />
              </div>
            )}
            <SearchField
              variant="primary"
              icon={'search'}
              placeholder="Search for component..."
              suggestions={equipmentGroups}
              onValueChanged={() => false}
              onClick={(componentName) =>
                history.push(
                  `${MAIN_ROUTES.BROWSE}${SUB_ROUTES.VIEW}/`.replace(
                    ':componentName',
                    componentName.replace(' ', '+')
                  )
                )
              }
            ></SearchField>
            <Button
              label={'Read and edit PDS datahandbook'}
              onClick={() => history.push(MAIN_ROUTES.READ)}
            />
            <Button
              label={'Browse and edit equipment data'}
              onClick={() => history.push(MAIN_ROUTES.BROWSE)}
            />
            <Button
              label={'Analysis'}
              onClick={() => history.push(MAIN_ROUTES.ANALYSIS)}
            />
            <Button
              label={'Review and publish data'}
              onClick={() => history.push(MAIN_ROUTES.SEE_ALL_EDITS)}
            />
            <Button
              label={'Administrate users'}
              onClick={() => history.push(MAIN_ROUTES.ADMIN)}
            />
          </div>
        ) : null}
        {userContext.user?.userGroupType === 'operator' ? (
          <div className={[styles.operatorMenu, styles.menu].join(' ')}>
            {inventoryLoad && (
              <div className={styles.loading}>
                <Loader type="Grid" color="grey" />
              </div>
            )}
            <SearchField
              variant="primary"
              icon={'search'}
              placeholder="Search for component..."
              suggestions={equipmentGroups}
              onValueChanged={() => false}
              onClick={(componentName) =>
                history.push(
                  `${MAIN_ROUTES.BROWSE}${SUB_ROUTES.VIEW}/`.replace(
                    ':componentName',
                    componentName.replace(' ', '+')
                  )
                )
              }
            ></SearchField>
            <Button
              label={'Read PDS datahandbook'}
              onClick={() => history.push(MAIN_ROUTES.READ)}
            />
            <Button
              label={'Browse equipment data'}
              onClick={() => history.push(MAIN_ROUTES.BROWSE)}
            />
            <Button
              label={'Inventory'}
              onClick={() => history.push(MAIN_ROUTES.INVENTORY)}
            />
            <Button
              label={'Notifications'}
              onClick={() => history.push(MAIN_ROUTES.NOTIFICATIONS)}
            />
            <Button
              label={'Analysis'}
              onClick={() => history.push(MAIN_ROUTES.ANALYSIS)}
            />
          </div>
        ) : null}
      </div>
      <div className={styles.footer}>
        <div className={styles.contact}>{'Contact info:'}</div>
        <div className={styles.contact}>{'Email: sintef@post.no'}</div>
      </div>
    </div>
  )
}
