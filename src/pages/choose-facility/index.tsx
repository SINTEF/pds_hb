import React from 'react'
import styles from './ChooseFacility.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/searchField'

export interface ChooseFacilityProps {
  onChange: (value: string) => void
}

export const ChooseFacility: React.FC<ChooseFacilityProps> = ({
  onChange,
}: ChooseFacilityProps) => {
  return (
    <div className={styles.container}>
      <Title title="Choose Facility" />
      <SearchField
        label="Facility"
        variant="secondary"
        placeholder="Choose facility to register data to..."
        suggestions={['Askeladden', 'Gullfaks A', 'Draugen', 'Troll A']}
        onValueChanged={(value) => onChange(value)}
      />
    </div>
  )
}
