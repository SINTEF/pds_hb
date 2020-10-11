import React from 'react'
import styles from './Frontpage.module.css'
import { SearchField } from '../search-field'
import { Button } from '../button'

export interface FrontpageProps {
  onChange: (value: string) => void

  userType: 'general' | 'operator' | 'moderator'

  suggestions: Array<string>

  onClick: () => void
}

export const Frontpage: React.FC<FrontpageProps> = ({
  onChange,
  userType = 'general',
  suggestions,
  onClick,
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
            suggestions={suggestions}
            onValueChanged={(value) => onChange(value)}
            onClick={() => false}
          ></SearchField>
          <Button label={'Read PDS datahandbook'} onClick={onClick}></Button>
          <Button label={'Browse equipment data'} onClick={onClick}></Button>
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
            onClick={onClick}
          ></Button>
          <Button
            label={'Browse and edit equipment data'}
            onClick={onClick}
          ></Button>
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
          <Button label={'Read PDS datahandbook'} onClick={onClick}></Button>
          <Button label={'Browse equipment data'} onClick={onClick}></Button>
          <Button
            label={'Browse own equipment data'}
            onClick={onClick}
          ></Button>
          <Button label={'Add data'} onClick={onClick}></Button>
        </div>
      ) : null}
    </div>
  )
}
