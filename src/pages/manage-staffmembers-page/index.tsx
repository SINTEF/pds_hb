import React, { useContext, useEffect, useState } from 'react'

import styles from './ManageStaffmembersPage.module.css'

import { Title } from '../../components/title'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUser, IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import useFetch, { CachePolicies } from 'use-http'
import { APIResponse } from '../../models/api-response'
import { ICompany } from '../../models/company'

interface InewUser {
  username: string
  email: string
  password: string
  phoneNr: string
  companyName: string
  userGroupType: string
}

// TO FIX: Needs error and loading handling
export const ManageStaffmembersPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const companyName = userContext.user?.companyName
  const defaultUser = {
    username: '',
    email: '',
    password: '',
    phoneNr: '',
    companyName: companyName as string,
    userGroupType: 'operator',
  }
  const [staffState, setStaff] = useState<IUser[]>([])
  const [userState, setUser] = useState<InewUser>(defaultUser)

  const { data: companyData } = useFetch<APIResponse<ICompany>>(
    '/company/' + companyName,
    []
  )

  const {
    get: staffGet,
    del: staffDel,
    response: staffResponse,
    post: staffPost,
  } = useFetch<APIResponse<IUser[]>>('/user', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    const staff = await staffGet('?companyName=' + companyName)
    if (staffResponse.ok) setStaff(staff.data)
  }

  // this doesn't happen immediately ???
  const removeUser = async (userid: string) => {
    await staffDel(userid)
    if (staffResponse.ok) {
      loadStaff()
    }
  }

  const registerUser = async (user: InewUser) => {
    await staffPost('/register', user)
    if (staffResponse.ok) loadStaff()
  } //send to backend

  const validUser = () => {
    return (
      userState?.username &&
      (userState?.email.includes('@gmail.com') ||
        userState?.email.includes('@hotmail.com') ||
        userState?.email.includes('@live.com')) &&
      userState?.password
    )
  }
  return (
    <div className={styles.pagebottompadding}>
      <div className={styles.container}>
        <Title title="Manage staffmembers" />
        <div className={styles.listtitles}>
          <div>{'Username'}</div>
          <div>{'Email'}</div>
          <div>{'    '}</div>
          <div>{'    '}</div>
          <div>{'Phone'}</div>
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
                      {user.phoneNr ? user.phoneNr : 'N/A'}
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
          <>
            <InputField
              label="Username"
              variant="standard"
              type="text"
              placeholder="OlaNordmann"
              value={userState?.username}
              onValueChanged={(value) =>
                setUser({ ...userState, username: value as string })
              }
            />
            <InputField
              label="Email"
              variant="standard"
              type="email"
              placeholder="ola.nordmann@gmail.com"
              value={userState?.email}
              onValueChanged={(value) =>
                setUser({ ...userState, email: value as string })
              }
            />
            <InputField
              label="Password"
              variant="standard"
              type="text"
              placeholder="a super safe psw"
              value={userState?.password}
              onValueChanged={(value) =>
                setUser({ ...userState, password: value as string })
              }
            />
          </>
        )}
      </div>
      <div className={styles.button}>
        {validUser() ? (
          <div className={styles.buttonContainer}>
            <Button
              label="Add company user"
              onClick={() => {
                registerUser(userState)
                setUser(defaultUser)
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
