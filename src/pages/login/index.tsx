import React, { useContext, useState } from 'react'
import useFetch, { CachePolicies } from 'use-http'
import { useHistory } from 'react-router-dom'

import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import { UserContext } from '../../utils/context/userContext'
import useLocalStorage from '../../utils/hooks/useLocalStorage'

import styles from './Login.module.css'
import jwt_decode from 'jwt-decode'
import { IUser, IUserContext } from '../../models/user'

export interface LoginForm {
  username: string
  password: string
}

export const Login: React.FC = () => {
  const { post, response } = useFetch('/user/login', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })
  const { setValue } = useLocalStorage<string>('token', '')
  const history = useHistory()
  const userContext = useContext(UserContext) as IUserContext
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  })

  const loginUser: () => Promise<void> = async () => {
    await post(form)
    if (response.status === 200) {
      const token = (response.data.token as string).split('Bearer')[1].trim()
      setValue(token)
      const decodedToken = jwt_decode(token) as IUser
      userContext.setUser(decodedToken)
      setTimeout(() => history.push('/'), 750)
    }
  }

  return (
    <div className={styles.main}>
      <h1>PDS Data Handbook</h1>
      <div className={styles.inputGroup}>
        <InputField
          label={'Username'}
          icon={'face'}
          onValueChanged={(value) =>
            setForm({ ...form, username: value as string })
          }
          success={response.status === 200}
        />

        <InputField
          label={'Password'}
          type={'password'}
          icon={'lock'}
          onValueChanged={(value) =>
            setForm({ ...form, password: value as string })
          }
          success={response.status === 200}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button label={'Log in'} type={'primary'} onClick={() => loginUser()} />
        <Button
          label={'Register new user'}
          onClick={() => {
            return
          }}
        />
      </div>
    </div>
  )
}