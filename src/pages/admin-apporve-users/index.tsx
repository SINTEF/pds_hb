import React, { useEffect, useState } from 'react'
import styles from './ApproveUsersPage.module.css'
import { Title } from '../../components/title'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch, { CachePolicies } from 'use-http'
import { IUser } from '../../models/user'
import { APIResponse } from '../../models/api-response'

export const ApproveUsersPage: React.FC = () => {
  const effect = {
    deleted: false,
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
    const users = await usersGet('/users?limit=20')
    if (usersResponse.ok) {
      const notApprovedUsers = users.result.filter(
        (user: IUser) =>
          user.userGroupType === 'none' && user.companyName === 'none'
      )
      setUsers(notApprovedUsers)
    }
  }

  // only update fileds when reload window???
  const discardUser = async (userid: string) => {
    await usersDel(userid)
    await getUsers()
    if (usersResponse.ok) {
      getUsers()
      effect.deleted = true
      await sleep(1000)
      effect.deleted = false
    }
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
            <div>{'     '}</div>
            <div>{'     '}</div>
            <div>{'     '}</div>
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
                        onClick={() => approveUser(user.username)}
                        key={idx}
                      >
                        {'Approve'}
                      </button>,
                      <button
                        className={styles.remove}
                        onClick={() => discardUser(user._id)}
                        key={idx}
                      >
                        {'Remove'}
                      </button>,
                    ]}
                  </RegisteredDataField>
                ) ?? []
            )}
          {
            effect.deleted && <div>{'User deleted!'}</div> // deleted never changes
          }
        </>
      ) : (
        <div>{'The eager PDS datahandbook readers are comming very soon!'}</div>
      )}
    </div>
  )
}
