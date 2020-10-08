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
  removeUser: (JSON: { name: string; mail: string; joined: string }) => void
}

export const ManageStaffmembersPage: React.FC<ManageStaffmembersPageProps> = ({
  getStaff,
  getTotalStaffNumber,
  sendMail,
  removeUser,
}: ManageStaffmembersPageProps) => {
  const [formState, setForm] = useState<string>('')
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
        {getStaff().map((user, idx) => (
          <RegisteredDataField key={idx}>
            {[
              <div key={idx}>{user.name}</div>,
              <div key={idx}>{user.mail}</div>,
              <div key={idx}>{user.joined}</div>,
              <button
                className={styles.remove}
                onClick={() => removeUser(user)}
                key={idx}
              >
                {'Remove'}
              </button>,
            ]}
          </RegisteredDataField>
        ))}
      </div>
      <div className={styles.secondcontainer}>
        <div className={styles.usersleft}>
          {'Your company has '}
          <div className={styles.numberusersleft}>
            {getTotalStaffNumber() - getStaff().length}
          </div>
          {' more possible users to add.'}
        </div>
        {getTotalStaffNumber() !== getStaff().length && (
          <InputField
            label="Email"
            variant="standard"
            placeholder="ola.nordmann@gmail.com"
            onValueChanged={(value) => setForm(value as string)}
          />
        )}
      </div>
      <div className={styles.button}>
        {formState.includes('@gmail.com') ||
        formState.includes('@hotmail.com') ||
        formState.includes('@live.com') ? (
          <Button
            label="Send invite"
            onClick={() => {
              sendMail(formState)
              setForm('')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
