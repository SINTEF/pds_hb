import React, { useState } from 'react'
import styles from './ManageFacilitiesPage.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'

export interface ManageFacilitiesPageProps {
  getFacilities: () => string[]
  editFacilities: (editFacilties: string | Record<string, string>) => void // send all facilities to backend, evt. including the changed one
}

export const ManageFacilitiesPage: React.FC<ManageFacilitiesPageProps> = ({
  getFacilities,
  editFacilities,
}: ManageFacilitiesPageProps) => {
  const [facilityState, setFacility] = useState<string>('')
  const [pageState, setPage] = useState<string>('')
  const oldFacility: string = facilityState
  return (
    <div>
      <div className={styles.title}>
        <Title title="Manage facilities" />
      </div>
      <div className={styles.padding}>
        {'Enter an existing facilty to edit or enter a new one'}
      </div>
      <div className={styles.padding}>
        <SearchField
          variant="secondary"
          label="Facilityname"
          placeholder="Enter name of facility..."
          suggestions={getFacilities()}
          onValueChanged={(value) => setFacility(value)}
          onClick={(selected) => {
            setFacility(selected)
            getFacilities().indexOf(selected) > -1
              ? setPage('Update facilityname')
              : setPage('Create new facility')
          }}
        />
      </div>
      {pageState === 'Create new facility' && (
        <div>
          <div className={styles.button}>
            <Button
              label="Add new facility"
              onClick={() => editFacilities(facilityState)}
            />
          </div>
        </div>
      )}
      {pageState === 'Update facilityname' && (
        <div>
          <div className={styles.padding}>
            <InputField
              label="New facilityname"
              variant="standard"
              placeholder="Enter name of new facility..."
              onValueChanged={(value) => setFacility(value as string)}
            />
          </div>
          <div className={styles.button}>
            <Button
              label="Assign new name"
              onClick={() => {
                setFacility(' ')
                editFacilities({ old: oldFacility, new: facilityState })
              }}
            />
            <Button
              label="Delete"
              onClick={() => {
                setFacility(' ')
                editFacilities({ old: oldFacility, new: 'delete' })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
