import React from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../searchField'
import { Button } from '../button'

export interface FrontpageProps {
  onChange: (value: string) => void

  userType: 'general' | 'operator' | 'moderator'
}

export const Frontpage: React.FC<FrontpageProps> = ({
  onChange,
  userType = 'general',
}: FrontpageProps) => {
  return (
    <div className={styles.frontpage}>
      <div className={styles.title}>{'PDS Datahåndbok'}</div>
      {userType === 'general' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={[
              'Flame detector',
              'Smoke detector',
              'Cake detector',
              'Metal detector',
              'Flamethrower',
              'banana',
            ]}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
          ></SearchField>
          <Button label={'Read PDS datahandbook'}></Button>
          <Button label={'Browse equipment data'}></Button>
        </div>
      ) : null}
      {userType === 'moderator' ? (
        <div className={[styles.generalMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={[
              'Flame detector',
              'Smoke detector',
              'Cake detector',
              'Metal detector',
              'Flamethrower',
              'banana',
            ]}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
          ></SearchField>
          <Button label={'Read and edit PDS datahandbook'}></Button>
          <Button label={'Browse and edit equipment data'}></Button>
        </div>
      ) : null}
      {userType === 'operator' ? (
        <div className={[styles.operatorMenu, styles.menu].join(' ')}>
          <SearchField
            variant="primary"
            icon={'search'}
            placeholder="Search for component..."
            suggestions={[
              'Flame detector',
              'Smoke detector',
              'Cake detector',
              'Metal detector',
              'Flamethrower',
              'banana',
            ]}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
          ></SearchField>
          <Button label={'Read PDS datahandbook'}></Button>
          <Button label={'Browse equipment data'}></Button>
          <Button label={'Browse own equipment data'}></Button>
          <Button label={'Add data'}></Button>
        </div>
      ) : null}
    </div>
  )
}
