import React, { useContext } from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES, { SUB_ROUTES } from '../../routes/routes.constants'
import useFetch from 'use-http'
import { IComponent } from '../../models/component'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

export const Frontpage: React.FC = () => {
  const history = useHistory()
  const { loading, error, data = [] } = useFetch('/component', [])
  const userContext = useContext(UserContext) as IUserContext 
  const suggestions = data.map((component: IComponent) => component.name)
  return (
    <div className={styles.frontpage}>
      <div className={styles.title}>{'PDS Datahandbook'}</div>
      {loading && 'Loading...'}
      {userContext.user?.userGroupId === 'general_user' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={() => false}
            onClick={(s) =>
              history.push(MAIN_ROUTES.BROWSE + SUB_ROUTES.VIEW + s)
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
      {userContext.user?.userGroupId === 'moderator' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={() => false}
            onClick={(s) =>
              history.push(MAIN_ROUTES.BROWSE + SUB_ROUTES.VIEW + s)
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
        </div>
      ) : null}
      {1===1 ? (
        <div className={[styles.operatorMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={() => false}
            onClick={(s) =>
              history.push(MAIN_ROUTES.BROWSE + SUB_ROUTES.VIEW + s)
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
            onClick={() => history.push(MAIN_ROUTES.COMPANY)}
          />
          <Button
            label={'Add data'}
            onClick={() => history.push(MAIN_ROUTES.ADD)}
          />
        </div>
      ) : (
        error && 'Error!'
      )}
    </div>
  )
}
