import React from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../searchField'
import { Button } from '../button'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

export interface FrontpageProps {
  onChange: (value: string) => void

  userType: 'general' | 'operator' | 'moderator'

  suggestions: Array<string>
}

export const Frontpage: React.FC<FrontpageProps> = ({
  onChange,
  userType = 'general',
  suggestions,
}: FrontpageProps) => {
  const history = useHistory()
  return (
    <div className={styles.frontpage}>
      <div className={styles.title}>{'PDS Datahåndbok'}</div>
      {userType === 'general' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
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
      {userType === 'moderator' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
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
      {userType === 'operator' ? (
        <div className={[styles.operatorMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={suggestions}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
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
      ) : null}
    </div>
  )
}
