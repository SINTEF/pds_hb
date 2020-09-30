import React from 'react'
import styles from './Frontpage.module.css'
import { Header } from '../header'
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
      <div className={styles.menu}>
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
        ></SearchField>
        <Button label={'Read PDS datahandbook'}></Button>
        <Button label={'Browse equipment data'}></Button>
      </div>
    </div>
  )
}
