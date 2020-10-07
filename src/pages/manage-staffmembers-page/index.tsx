import React, { useState } from 'react'

import styles from './ManageStaffmembersPage.module.css'

import { Title } from '../../components/title'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { RegisteredDataField } from '../../components/registered-data-field'

export interface ManageStaffmembersPageProps {
  getStaff: () => {
    name: string
    mail: string
    joined: string
  }[]
  getTotalStaffNumber: () => number
  sendMail: (mail: string) => void
}

export const ManageStaffmembersPage: React.FC<ManageStaffmembersPageProps> = ({
  getStaff,
  getTotalStaffNumber,
  sendMail,
}: ManageStaffmembersPageProps) => {
  const [formState, setForm] = useState<string>('ola.nordmann@gmail.com')
  return (
    <div className={styles.container}>
      <div className={[styles.padding, styles.center].join(' ')}>
        <Title title="Manage staffmembers" />
        {Object.keys(getStaff).map((user) => (
          <RegisteredDataField
            component={user}
            period={user}
            edited={user}
            key={user}
          />
        ))}
      </div>
      <div className={styles.usersleft}>
        {'Your company has '}
        <div className={styles.numberusersleft}>
          {getTotalStaffNumber() - getStaff().length}
        </div>
        {' more possible users to add.'}
      </div>
      <InputField
        label="Email"
        variant="standard"
        placeholder={formState}
        onValueChanged={(value) => setForm(value as string)}
      />
      <div className={styles.button}>
        {formState.includes('@gmail.com') ||
        formState.includes('@hotmail.com') ||
        formState.includes('@live.com') ? (
          <Button
            label="Send invite"
            onClick={() => {
              sendMail(formState) // remember to decrease numberOfUsersLeft
              setForm('')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
