import React, { useState } from 'react'
import styles from './AddCompanyPage.module.css'
import useFetch from 'use-http'
import { Title } from '../../components/title'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import { ICompany } from '../../models/company'
import { APIResponse } from '../../models/api-response'

interface companyForm {
  name: string | null
  organizationNr: string | null
  // companyEmail: string | null
  // ceoEmail: string | null //send a mail to this user making it a company user with connection to the new company
  // the ceo adds a phonenumber, description and an array of facilities
  email: string | null
  maxUsers: number | null
}

export const AddCompanyPage: React.FC = () => {
  const [pageState, setPage] = useState<number>(1)
  const [companyState, setCompany] = useState<companyForm>({
    name: null,
    organizationNr: null,
    //companyEmail: null,
    //ceoEmail: null,
    email: null,
    maxUsers: null,
  })

  const { post: companyPost, response: companyResponse } = useFetch<
    APIResponse<ICompany>
  >('/company')

  const handleNewCompany = async () => {
    await companyPost(companyState)
    if (companyResponse.ok) {
      setPage(2)
      setCompany({
        name: null,
        organizationNr: null,
        //companyEmail: null,
        //ceoEmail: null,
        email: null,
        maxUsers: null,
      })
    }
    if (!companyResponse.ok) {
      setPage(3)
      setCompany({
        name: null,
        organizationNr: null,
        //companyEmail: null,
        //ceoEmail: null,
        email: null,
        maxUsers: null,
      })
    }
  }

  const validCompany = () => {
    return (
      companyState.organizationNr &&
      companyState.name &&
      //companyState.companyEmail &&
      //companyState.ceoEmail &&
      companyState.email &&
      companyState.maxUsers
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
          {/*<InputField
            variant="standard"
            label="Company email"
            placeholder="Enter an email for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, companyEmail: value as string })
            }
        />*/}
          {/*<InputField
            variant="standard"
            label="CEO email"
            placeholder="Enter an email for the CEO of the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, ceoEmail: value as string })
            }
        />*/}
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
                  handleNewCompany()
                }}
              />
            </div>
          )}
        </div>
      )}
      {pageState === 2 && (
        <div className={[styles.container, styles.center].join(' ')}>
          {'Company successfully added'}
          <Button label="Add another comapny" onClick={() => setPage(1)} />
        </div>
      )}
      {pageState === 3 && (
        <div className={[styles.container, styles.center].join(' ')}>
          {'Oh no, could not add company...'}
          <Button
            label="Try adding another comapny"
            onClick={() => setPage(1)}
          />
        </div>
      )}
    </div>
  )
}
