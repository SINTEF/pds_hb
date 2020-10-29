import React, { useEffect, useState } from 'react'
import styles from './ApproveUsersPage.module.css'
import { Title } from '../../components/title'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch from 'use-http'
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
  } = useFetch<APIResponse<IUser[]>>('/user')

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    const users = await usersGet('/users')
    if (usersResponse.ok) {
      const notApprovedUsers = users.result.filter(
        (user: IUser) => user.userGroupType === 'none'
      )
      setUsers(notApprovedUsers)
    }
  }

  // only update fileds when reload window???
  const discardUser = async (userid: string) => {
    await usersDel(userid)
    await usersGet()
    if (usersResponse.ok) {
      getUsers()
      effect.deleted = true
      await sleep(1000)
      effect.deleted = false
    }
  }

  const approveUser = async (userid: string) => {
    const updatedUser = { userGroupType: 'general_user' }
    if (usersResponse.ok) await usersPut('/update/' + userid, updatedUser)
  }

  return (
    <div className={styles.container}>
      <Title title="Approve new users" />
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
                    onClick={() => approveUser(user._id)}
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
    </div>
  )
}
