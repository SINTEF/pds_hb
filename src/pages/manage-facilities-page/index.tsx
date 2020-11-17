import React, { useContext, useState } from 'react'
import styles from './ManageFacilitiesPage.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import useFetch, { CachePolicies } from 'use-http'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'

//TO FIX: Needs types for facility and communications with server
export const ManageFacilitiesPage: React.FC = () => {
  const [facilityState, setFacility] = useState<string>('')
  const [newFacilityState, setNewFacility] = useState<string>('')
  const [pageState, setPage] = useState<string>('')

  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName

  const { put, response, get, data: companyData = [] } = useFetch(
    '/company/' + companyName,
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )

  const updateFacilitites = async (facilities: string[]) => {
    await put({ facilities: facilities })
    if (response.ok) get()
  }

  const facilities = companyData.data?.facilities ?? []

  return (
    <div className={styles.container}>
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
          allowAllInputs={true}
          suggestions={facilities}
          onValueChanged={(value) => setFacility(value)}
          onClick={(selected) => {
            setFacility(selected)
            facilities.indexOf(selected) > -1 && setPage('Update facilityname')
          }}
        />
      </div>
      {facilities.indexOf(facilityState) < 0 && facilityState !== '' && (
        <div>
          <div className={styles.button}>
            <Button
              label="Add new facility"
              onClick={() => updateFacilitites([...facilities, facilityState])}
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
              placeholder="Enter new name of facility..."
              value={newFacilityState}
              onValueChanged={(value) => setNewFacility(value as string)}
            />
          </div>
          <div className={styles.button}>
            <Button
              label="Assign new name"
              onClick={() => {
                updateFacilitites([
                  ...facilities.filter(
                    (facility: string) => facility !== facilityState
                  ),
                  newFacilityState,
                ])
                setNewFacility('')
                setFacility('')
                setPage('')
              }}
            />
            <Button
              label="Delete"
              onClick={() => {
                updateFacilitites(
                  facilities.filter(
                    (facility: string) => facility !== facilityState
                  )
                )
                setFacility('')
                setPage('')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
