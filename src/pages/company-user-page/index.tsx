import React, { useContext } from 'react'

import styles from './CompanyUserPage.module.css'

import { Title } from '../../components/title'
import { EditableField } from '../../components/editable-field'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import useFetch from 'use-http'

export const CompanyUserPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext

  const { data: companyData } = useFetch(
    '/company=' + userContext.user?.companyName,
    []
  )

  const uploadImg = () => {
    return ''
  }

  const photoIcon = 'camera_alt'

  return (
    <div className={styles.container}>
      <Title title="Company user" />
      <div className={styles.photocontainer}>
        <div className={styles.photo}>
          {companyData.photo !== 'none'
            ? companyData.photo
            : companyData.companyName.charAt(0)}
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
          content={companyData.companyName}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Email"
          content={companyData.email}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Phone"
          content={companyData.phone}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Description"
          content={companyData.description}
          mode="view"
          isAdmin={true}
        />
      </div>
    </div>
  )
}
