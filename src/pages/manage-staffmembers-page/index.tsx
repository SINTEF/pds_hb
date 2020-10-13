import React, { useContext, useState } from 'react'

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

export const ManageStaffmembersPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName

  const { data: companyData } = useFetch<APIResponse<ICompany>>(
    '/company/?companyId=' + companyName,
    []
  )

  const { get: staffGet, data: staffData } = useFetch<APIResponse<IUser[]>>(
    '/user/?companyId=' + companyName,
    []
  )

  const { del, response: facilitiesResponse } = useFetch('/update')

  const removeUser = async (user: string) => {
    await del(user)
    if (facilitiesResponse.ok) staffGet()
  }

  const [mailState, setMail] = useState<string>('')

  const sendMail = (email: string) => {
    return email
  } //send to backend
  return (
    <div>
      <div className={styles.container}>
        <Title title="Manage staffmembers" />
        <div className={styles.listtitles}>
          <div>{'Name'}</div>
          <div>{'Email'}</div>
          <div>{'Joined'}</div>
          <div>{'      '}</div>
        </div>
        {staffData?.data.map(
          (
            user,
            idx // type any?
          ) =>
            (
              <RegisteredDataField key={idx}>
                {[
                  <div key={idx}>{user.username}</div>,
                  <div key={idx}>{user.email}</div>,
                  <div key={idx}>{user.phoneNr}</div>,
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
            {companyData?.data.maxUsers ?? 0 - (staffData?.data ?? []).length}
          </div>
          {' more possible users to add.'}
        </div>
        {companyData?.data.maxUsers !== staffData?.data.length && (
          <InputField
            label="Email"
            variant="standard"
            placeholder="ola.nordmann@gmail.com"
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
