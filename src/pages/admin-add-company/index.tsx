import React, { useState } from 'react'
import useFetch from 'use-http'
import { Title } from '../../components/title'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'
import { ICompany } from '../../models/company'
import { APIResponse } from '../../models/api-response'

interface companyForm {
  name: string | null
  organisationNr: string | null
  companyEmail: string | null
  ceoEmail: string | null //send a mail to this user making it a company user with connection to the new company
  // the ceo adds a phonenumber, description and an array of facilities
  created: Date
  maxUsers: number | null
}

export const AddCompanyPage: React.FC = () => {
  const today = new Date()

  const [pageState, setPage] = useState<number>(1)
  const [companyState, setCompany] = useState<companyForm>({
    name: null,
    organisationNr: null,
    companyEmail: null,
    ceoEmail: null,
    created: today,
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
        organisationNr: null,
        companyEmail: null,
        ceoEmail: null,
        created: today,
        maxUsers: null,
      })
    }
  }

  const validCompany = () => {
    return (
      companyState.organisationNr &&
      companyState.name &&
      companyState.companyEmail &&
      companyState.ceoEmail &&
      companyState.maxUsers
    )
  }

  return (
    <div>
      <Title title="Add new companies" />
      {pageState === 1 && (
        <div>
          <InputField
            label="Company name"
            placeholder="Enter a name for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, name: value as string })
            }
          />
          <InputField
            label="Organisation Number"
            placeholder="Enter the orgNr for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, organisationNr: value as string })
            }
          />
          <InputField
            label="Company email"
            placeholder="Enter an email for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, companyEmail: value as string })
            }
          />
          <InputField
            label="CEO email"
            placeholder="Enter an email for the CEO of the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, ceoEmail: value as string })
            }
          />
          <InputField
            label="Max users"
            placeholder="Enter a number for max users for the new company..."
            onValueChanged={(value) =>
              setCompany({ ...companyState, maxUsers: value as number })
            }
          />
          {validCompany && (
            <Button label="Add company" onClick={handleNewCompany} />
          )}
        </div>
      )}
      {pageState === 2 && <div>{'Company successfully added'}</div>}
    </div>
  )
}
