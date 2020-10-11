import React, { useState } from 'react'
import useFetch, { CachePolicies } from 'use-http'
import { useHistory } from 'react-router-dom'

import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import useLocalStorage from '@rooks/use-localstorage'

import styles from './Login.module.css'

export interface LoginForm {
  username: string
  password: string
}

export const Login: React.FC = () => {
  const { post, response } = useFetch('/user/login', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })
  const [, set] = useLocalStorage('token', '')
  const history = useHistory()
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  })

  const loginUser: () => Promise<void> = async () => {
    await post(form)
    if (response.status === 200) {
      const token = (response.data.token as string).split('Bearer')[1].trim()
      set(token)
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
