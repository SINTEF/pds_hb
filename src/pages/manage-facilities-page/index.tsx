import React, { useContext, useState } from 'react'
import styles from './ManageFacilitiesPage.module.css'

import { Title } from '../../components/title'
import { SearchField } from '../../components/search-field'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import useFetch from 'use-http'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'

//TO FIX: Needs types for facility and communications with server
export const ManageFacilitiesPage: React.FC = () => {
  const [facilityState, setFacility] = useState<string>('')
  const [pageState, setPage] = useState<string>('')

  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName

  const { get, data: companyData = [] } = useFetch(
    '/company/' + companyName,
    []
  )

  const { put, response: facilitiesResponse } = useFetch('/update') //fix this path later

  const updateFacilitites = async (facilities: string[]) => {
    await put(facilities)
    if (facilitiesResponse.ok) get()
  }

  const facilities = companyData.data?.facilities ?? []

  const changeFacility = (facility: string) => {
    facilities.splice(facilities.indexOf(facilityState), 1, facility)
  }

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
          allowAllInputs={true}
          suggestions={facilities}
          onValueChanged={(value) => setFacility(value)}
          onClick={(selected) => {
            setFacility(selected)
            facilities.indexOf(selected) > -1
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
              placeholder="Enter name of new facility..."
              value={facilityState}
              onValueChanged={(value) => setFacility(value as string)}
            />
          </div>
          <div className={styles.button}>
            <Button
              label="Assign new name"
              onClick={() => {
                setFacility(' ')
                updateFacilitites(facilities.splice())
              }}
            />
            <Button
              label="Delete"
              onClick={() => {
                setFacility(' ')
                changeFacility(facilityState)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
