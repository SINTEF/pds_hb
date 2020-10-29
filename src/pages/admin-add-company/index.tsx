import React, { useState } from 'react'
import styles from './AddCompanyPage.module.css'
import useFetch from 'use-http'
import { Title } from '../../components/title'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import { ICompany } from '../../models/company'
import { APIResponse } from '../../models/api-response'
import { IUser } from '../../models/user'

interface InewCompany {
  name: string
  organizationNr: string
  email: string
  phoneNr: string
  description: string
  facilities: Array<string>
  maxUsers: number | null
}

interface InewUser {
  username: string
  password: string
  email: string
  phoneNr: string
  companyName: string
  userGroupType: string
}

export const AddCompanyPage: React.FC = () => {
  const [pageState, setPage] = useState<number>(1)
  const defaultCompany = {
    name: '',
    organizationNr: '',
    email: '',
    phoneNr: '',
    description: '',
    facilities: [],
    maxUsers: null,
  }
  const defaultUser = {
    username: '',
    password: '',
    email: '',
    phoneNr: '',
    companyName: '',
    userGroupType: 'operator',
  }
  const [companyState, setCompany] = useState<InewCompany>(defaultCompany)
  const [userState, setUser] = useState<InewUser>(defaultUser)

  const { post: companyPost, response: companyResponse } = useFetch<
    APIResponse<ICompany>
  >('/company')

  const { post: userPost, response: userResponse } = useFetch<
    APIResponse<IUser>
  >('/user/register')

  const handleNewCompany = async () => {
    await companyPost(companyState)
    if (companyResponse.ok) {
      setPage(2)
      setCompany(defaultCompany)
    }
    if (!companyResponse.ok) {
      setPage(4)
      setCompany(defaultCompany)
    }
  }

  const handleNewCEO = async () => {
    await userPost(userState)
    if (userResponse.ok) {
      setPage(3)
      setUser(defaultUser)
    }
    if (!userResponse.ok) {
      setPage(5)
      setUser(defaultUser)
    }
  }

  const validCompany = () => {
    return (
      companyState.organizationNr &&
      companyState.name &&
      companyState.email &&
      companyState.phoneNr &&
      companyState.maxUsers
    )
  }

  const validCEO = () => {
    return (
      userState.username &&
      userState.password &&
      userState.email &&
      userState.phoneNr &&
      userState.companyName
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title title="Add new companies" />
      </div>
      {pageState === 1 && (
        <div>
          <InputField
            variant="standard"
            label="Company name"
            placeholder="Enter a name for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, name: value as string })
            }
          />
          <InputField
            variant="standard"
            type="number"
            label="Organisation Number"
            placeholder="Enter the orgNr for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, organizationNr: value as string })
            }
          />
          <InputField
            variant="standard"
            label="Email"
            placeholder="Enter an email for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, email: value as string })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Phone number"
            placeholder="Enter a phone number for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, phoneNr: value as string })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Description"
            placeholder="Enter a description for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, description: value as string })
            }
          />
          <InputField
            variant="standard"
            type="number"
            label="Max users"
            placeholder="Enter a number for max users for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, maxUsers: value as number })
            }
          />
          {validCompany() && (
            <div className={styles.button}>
              <Button
                label="Add company"
                onClick={() => {
                  setUser({
                    ...userState,
                    companyName: companyState.name,
                  })
                  handleNewCompany()
                }}
              />
            </div>
          )}
        </div>
      )}
      {pageState === 2 && (
        <div>
          <div className={styles.addCEO}>
            <div>{'Company successfully added!'}</div>
            <div>{'Please assign a CEO for the new company.'}</div>
          </div>
          <div>
            <InputField
              variant="standard"
              label="Username"
              placeholder="Enter an username for the new CEO..."
              onValueChanged={(value) =>
                setUser({ ...userState, username: value as string })
              }
            />
            <InputField
              variant="standard"
              type="email"
              label="Email"
              placeholder="Enter an email for the new CEO..."
              onValueChanged={(value) =>
                setUser({ ...userState, email: value as string })
              }
            />
            <InputField
              variant="standard"
              label="PhoneNr"
              placeholder="Enter a phone number for the new CEO..."
              onValueChanged={(value) =>
                setUser({ ...userState, phoneNr: value as string })
              }
            />
            <InputField
              variant="standard"
              label="Password"
              placeholder="Enter a password for the new CEO..."
              onValueChanged={(value) =>
                setUser({ ...userState, password: value as string })
              }
            />
            {validCEO() && (
              <div className={styles.button}>
                <Button
                  label="Add CEO"
                  onClick={() => {
                    handleNewCEO()
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {pageState === 3 && (
        <div className={[styles.container, styles.center].join(' ')}>
          {'CEO successfully added!'}
          <Button label="Add another company" onClick={() => setPage(1)} />
        </div>
      )}
      {pageState === 4 && (
        <div className={[styles.container, styles.center].join(' ')}>
          {'Oh no, could not add company...'}
          <Button label="Try adding comapny again" onClick={() => setPage(1)} />
        </div>
      )}
      {pageState === 5 && (
        <div className={[styles.container, styles.center].join(' ')}>
          {'Oh no, could not add CEO...'}
          <Button label="Try adding CEO again" onClick={() => setPage(2)} />
        </div>
      )}
    </div>
  )
}
