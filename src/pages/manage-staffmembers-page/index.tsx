import React, { useContext, useEffect, useState } from 'react'

import styles from './ManageStaffmembersPage.module.css'

import { Title } from '../../components/title'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUser, IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import useFetch from 'use-http'
import { APIResponse } from '../../models/api-response'
import { ICompany } from '../../models/company'

// TO FIX: Needs error and loading handling
export const ManageStaffmembersPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName
  const [staffState, setStaff] = useState<IUser[]>([])
  const [mailState, setMail] = useState<string>('')

  const { data: companyData } = useFetch<APIResponse<ICompany>>(
    '/company/' + companyName,
    []
  )

  const { get: staffGet, del: staffDel, response: staffResponse } = useFetch<
    APIResponse<IUser[]>
  >('/user')

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    const staff = await staffGet('?company=' + companyName)
    if (staffResponse.ok) setStaff(staff.data)
  }

  // this doesn't happen immediately ???
  const removeUser = async (userid: string) => {
    await staffDel(userid)
    if (staffResponse.ok) {
      loadStaff()
    }
  }

  const sendMail = (email: string) => {
    return email
  } //send to backend
  return (
    <div>
      <div className={styles.container}>
        <Title title="Manage staffmembers" />
        <div className={styles.listtitles}>
          <div>{'Username'}</div>
          <div>{'Email'}</div>
          <div>{'Phone'}</div>
          <div>{'     '}</div>
        </div>
        {staffState &&
          staffState.map(
            (
              user,
              idx // type any?
            ) =>
              (
                <RegisteredDataField key={idx}>
                  {[
                    <div key={idx}>{user.username}</div>,
                    <div className={styles.position} key={idx}>
                      {user.email}
                    </div>,
                    <div className={styles.padding} key={idx}>
                      {user.phoneNr}
                    </div>,
                    <button
                      className={styles.remove}
                      onClick={() => removeUser(user._id)}
                      key={idx}
                    >
                      {'Remove'}
                    </button>,
                  ]}
                </RegisteredDataField>
              ) ?? []
          )}
      </div>
      <div className={styles.secondcontainer}>
        <div className={styles.usersleft}>
          {'Your company has '}
          <div className={styles.numberusersleft}>
            {(companyData?.data.maxUsers ?? 0) - (staffState.length ?? 0)}
          </div>
          {' more possible users to add.'}
        </div>
        {companyData?.data.maxUsers !== staffState.length && (
          <InputField
            label="Email"
            variant="standard"
            type="email"
            placeholder="ola.nordmann@gmail.com"
            value={mailState}
            onValueChanged={(value) => setMail(value as string)}
          />
        )}
      </div>
      <div className={styles.button}>
        {mailState.includes('@gmail.com') ||
        mailState.includes('@hotmail.com') ||
        mailState.includes('@live.com') ? (
          <div className={styles.buttonContainer}>
            <Button
              label="Send invite"
              onClick={() => {
                sendMail(mailState)
                setMail('')
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
