import React, { useContext } from 'react'

import styles from './CompanyUserPage.module.css'

import { Title } from '../../components/title'
import { EditableField } from '../../components/editable-field'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import useFetch from 'use-http'
import Loader from 'react-loader-spinner'
import { APIResponse } from '../../models/api-response'
import { ICompany } from '../../models/company'

// TO COMPLETE: Needs communication with server to save changes
export const CompanyUserPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext

  const { data: companyData, loading } = useFetch<APIResponse<ICompany>>(
    '/company/' + userContext.user?.companyName,
    []
  )

  const uploadImg = () => {
    return ''
  }

  const photoIcon = 'camera_alt'

  return (
    <div className={styles.container}>
      {loading && !companyData ? (
        // This is not pretty, since it isn't centered
        <Loader type="Grid" color="grey" />
      ) : (
        <>
          <Title title="Company user" />
          <div className={styles.photocontainer}>
            <div className={styles.photo}>
              {companyData?.data.photo
                ? companyData.data.photo
                : companyData?.data.name.charAt(0)}
            </div>
            <i
              className={['material-icons ', styles.editphoto].join(' ')}
              onClick={uploadImg} // and update in backend
            >
              {photoIcon}
            </i>
          </div>
          <div className={styles.width}>
            <EditableField // need a function prop to store the changed value so its possible to update db
              index="Name"
              content={companyData?.data.name}
              mode="view"
              isAdmin={true}
            />
            <EditableField
              index="Email"
              content={companyData?.data.email}
              mode="view"
              isAdmin={true}
            />
            <EditableField
              index="Phone"
              content={companyData?.data.phoneNr}
              mode="view"
              isAdmin={true}
            />
            <EditableField
              index="Description"
              content={companyData?.data.description}
              mode="view"
              isAdmin={true}
            />
          </div>
        </>
      )}
    </div>
  )
}
