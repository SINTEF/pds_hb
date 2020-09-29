import React, { useState } from 'react'

import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

import styles from './Login.module.css'

export interface LoginForm {
  username: string
  password: string
}

export const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  })

  const [success, setSuccess] = useState<boolean>(false)

  const login: () => void = () => {
    setSuccess(true)
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
          success={success}
        />

        <InputField
          label={'Password'}
          type={'password'}
          icon={'lock'}
          onValueChanged={(value) =>
            setForm({ ...form, password: value as string })
          }
          success={success}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button label={'Log in'} type={'primary'} onClick={() => login()} />
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
