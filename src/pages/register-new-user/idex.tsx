import React, { useState } from 'react'

import styles from './RegisterNewUserPage.module.css'

import { Title } from '../../components/title'
import useFetch from 'use-http'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import { useHistory } from 'react-router-dom'

interface INewUser {
  username: string
  email: string
  password: string
  companyName: string
  userGroupType: string
}

export const RegisterNewUserPage: React.FC = () => {
  const defaultUser = {
    username: '',
    email: '',
    password: '',
    companyName: 'none',
    userGroupType: 'none',
  }
  const [newUserState, setNewUser] = useState<INewUser>(defaultUser)
  const [pswState, setPsw] = useState<string>('')
  const history = useHistory()

  const { post: userPost, response: userResponse, error: userError } = useFetch(
    '/user/register'
  )

  const registerUser = async (user: INewUser) => {
    await userPost(user)
  }

  const readyToRegister = () => {
    return (
      newUserState.username !== '' &&
      newUserState.email !== '' &&
      newUserState.password !== '' &&
      newUserState.password === pswState
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Register new user" />
      </div>
      <div className={styles.padding}>
        <InputField
          variant="standard"
          label="Username"
          value={newUserState?.username}
          onValueChanged={(value) =>
            setNewUser({ ...newUserState, username: value as string })
          }
        />
        <InputField
          variant="standard"
          type="email"
          label="Email"
          value={newUserState?.email}
          onValueChanged={(value) =>
            setNewUser({ ...newUserState, email: value as string })
          }
        />
        <InputField
          variant="standard"
          label="Password"
          type="password"
          value={newUserState?.password}
          onValueChanged={(value) =>
            setNewUser({ ...newUserState, password: value as string })
          }
        />
        <InputField
          variant="standard"
          label="Repeat password"
          type="password"
          value={pswState}
          onValueChanged={(value) => setPsw(value as string)}
        />
        {readyToRegister() && (
          <div className={styles.button}>
            <Button
              label="Register new user"
              onClick={() => {
                registerUser(newUserState)
                setNewUser(defaultUser)
                setPsw('')
              }}
            />
          </div>
        )}
        {userResponse.ok ? (
          <>
            <p className={styles.responseOk}>{userResponse.data?.message}</p>
            <div onClick={() => history.push('/')} className={styles.back}>
              {'Back tologin page'}
            </div>
          </>
        ) : null}
        {userError ? (
          <p className={styles.responseError}>{userResponse.data?.message}</p>
        ) : null}
      </div>
    </div>
  )
}
