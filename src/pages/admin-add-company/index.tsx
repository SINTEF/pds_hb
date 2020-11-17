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
  maxUsers: number
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
    maxUsers: 0,
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
            value={companyState.name}
            placeholder="Enter a name for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, name: value as string })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Organisation Number"
            value={companyState.organizationNr}
            placeholder="Enter the orgNr for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, organizationNr: value as string })
            }
          />
          <InputField
            variant="standard"
            label="Email"
            value={companyState.email}
            placeholder="Enter an email for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, email: value as string })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Phone number"
            value={companyState.phoneNr}
            placeholder="Enter a phone number for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, phoneNr: value as string })
            }
          />
          <InputField
            variant="standard"
            type="text"
            label="Description"
            value={companyState.description}
            placeholder="Enter a description for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, description: value as string })
            }
          />
          <InputField
            variant="standard"
            type="number"
            label="Max users"
            value={companyState.maxUsers}
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
            <div>{'Please assign a contact person for the new company.'}</div>
          </div>
          <div>
            <InputField
              variant="standard"
              label="Username"
              value={userState.username}
              placeholder="Enter an username..."
              onValueChanged={(value) =>
                setUser({ ...userState, username: value as string })
              }
            />
            <InputField
              variant="standard"
              type="email"
              label="Email"
              value={userState.email}
              placeholder="Enter an email..."
              onValueChanged={(value) =>
                setUser({ ...userState, email: value as string })
              }
            />
            <InputField
              variant="standard"
              label="PhoneNr"
              value={userState.phoneNr}
              placeholder="Enter a phone number..."
              onValueChanged={(value) =>
                setUser({ ...userState, phoneNr: value as string })
              }
            />
            <InputField
              variant="standard"
              type="password"
              label="Password"
              value={userState.password}
              placeholder="Enter a password..."
              onValueChanged={(value) =>
                setUser({ ...userState, password: value as string })
              }
            />
            {validCEO() && (
              <div className={styles.button}>
                <Button
                  label="Add contact person"
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
          {'Contact person successfully added!'}
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
          {'Oh no, could not add the contact person...'}
          <Button
            label="Try adding the contact person again"
            onClick={() => setPage(2)}
          />
        </div>
      )}
    </div>
  )
}
