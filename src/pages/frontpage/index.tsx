import React, { useContext, useEffect, useState } from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'
import useFetch, { CachePolicies } from 'use-http'
import { IComponent } from '../../models/component'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { APIResponse } from '../../models/api-response'

export const Frontpage: React.FC = () => {
  const history = useHistory()
  const { error } = useFetch<APIResponse<IComponent[]>>('/components', [])

  const userContext = useContext(UserContext) as IUserContext

  const [components, setComponents] = useState<IComponent[]>([])

  const {
    get: componentGet,
    response: componentResponse,
    loading: componentLoad,
  } = useFetch<APIResponse<IComponent>>('/components', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const loadComponents = async () => {
      const components = await componentGet()
      if (componentResponse.ok) setComponents(components.data)
    }
    loadComponents()
  }, [componentGet, componentResponse])

  const suggestions = components.map((component) => component.name) ?? []

  return componentLoad || !userContext ? (
    <div className={styles.loading}>Loading</div>
  ) : (
    <div className={styles.frontpage}>
      <div className={styles.title}>{'PDS Datahandbook'}</div>
      {userContext.user?.userGroupType === 'general_user' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
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
        <div className={[styles.adminMenu, styles.menu].join(' ')}>
          {componentLoad && 'Loading...'}
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
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
            label={'Administrate'}
            onClick={() => history.push(MAIN_ROUTES.ADMIN)}
          />
        </div>
      ) : null}
      {userContext.user?.userGroupType === 'operator' ? (
        <div className={[styles.operatorMenu, styles.menu].join(' ')}>
          {componentLoad && 'Loading...'}
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
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
        </div>
      ) : (
        error && 'Error!'
      )}
      <div className={styles.footer}>
        <div className={styles.contact}>{'Contact info:'}</div>
        <div className={styles.contact}>{'Email: sintef@post.no'}</div>
      </div>
    </div>
  )
}
