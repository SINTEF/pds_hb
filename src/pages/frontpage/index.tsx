import React, { useContext } from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES, {
  COMPANY_SUB_ROUTES,
  SUB_ROUTES,
} from '../../routes/routes.constants'
import useFetch from 'use-http'
import { IComponent } from '../../models/component'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import { APIResponse } from '../../models/api-response'

export const Frontpage: React.FC = () => {
  const history = useHistory()
  const { loading, error, data } = useFetch<APIResponse<IComponent[]>>(
    '/components',
    []
  )
  const userContext = useContext(UserContext) as IUserContext
  const suggestions = data?.data.map((component) => component.name) ?? []
  return (
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
          {loading && 'Loading...'}
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
          {loading && 'Loading...'}
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
            label={'Browse own equipment data'}
            onClick={() =>
              history.push(MAIN_ROUTES.COMPANY + COMPANY_SUB_ROUTES.REG_DATA)
            }
          />
          <Button
            label={'Add data'}
            onClick={() => history.push(MAIN_ROUTES.ADD)}
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
