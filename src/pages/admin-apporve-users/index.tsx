import React, { useEffect, useState } from 'react'
import styles from './ApproveUsersPage.module.css'
import { Title } from '../../components/title'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch, { CachePolicies } from 'use-http'
import { IUser } from '../../models/user'
import { APIResponse } from '../../models/api-response'

export const ApproveUsersPage: React.FC = () => {
  const effect = {
    show: false,
  }
  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }
  const [usersState, setUsers] = useState<IUser[]>([])
  const {
    del: usersDel,
    get: usersGet,
    response: usersResponse,
    put: usersPut,
  } = useFetch<APIResponse<IUser[]>>('/user', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    const users = await usersGet('/?userGroupType=none')
    if (usersResponse.ok) {
      const notApprovedUsers = users.data
      setUsers(notApprovedUsers ?? [])
    }
  }

  // only update fileds when reload window???
  const discardUser = async (userid: string) => {
    await usersDel(userid)
    await getUsers()
    if (usersResponse.ok) getUsers()
  }

  // this also doesn't work properly
  const approveUser = async (username: string) => {
    const updatedUser = { userGroupType: 'general_user' }
    await usersPut('/' + username, updatedUser)
    await getUsers()
  }

  return (
    <div className={styles.container}>
      <Title title="Approve new users" />
      {usersState.length > 0 ? (
        <>
          <div className={styles.listtitles}>
            <div>{'Name'}</div>
            <div>{'Email'}</div>
          </div>
          {usersState &&
            usersState?.map(
              (
                user,
                idx // type any?
              ) =>
                (
                  <RegisteredDataField key={idx}>
                    {[
                      <div key={idx}>{user.username}</div>,
                      <div key={idx}>{user.email}</div>,
                      <button
                        className={styles.approve}
                        onClick={() => {
                          approveUser(user.username)
                          effect.show = true
                          sleep(2000)
                          effect.show = false
                        }}
                        key={idx}
                      >
                        {'Approve'}
                      </button>,
                      <button
                        className={styles.remove}
                        onClick={() => {
                          discardUser(user._id)
                          effect.show = true
                          sleep(2000)
                          effect.show = false
                        }}
                        key={idx}
                      >
                        {'Remove'}
                      </button>,
                    ]}
                  </RegisteredDataField>
                ) ?? []
            )}
          {
            effect.show && <div>{'Success!'}</div> // show never changes
          }
        </>
      ) : (
        <div>{'The eager PDS datahandbook readers are comming very soon!'}</div>
      )}
    </div>
  )
}
