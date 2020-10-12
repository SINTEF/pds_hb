import React from 'react'

import styles from './CompanyUserPage.module.css'

import { Title } from '../../components/title'
import { EditableField } from '../../components/editable-field'

export interface CompanyUserPageProps {
  getCompany: () => {
    companyName: string
    email: string
    phone: string
    description: string
    photo: string
  }
  photoIcon?: string
  uploadImg?: () => void
}

export const CompanyUserPage: React.FC<CompanyUserPageProps> = ({
  getCompany,
  photoIcon = 'camera_alt',
  uploadImg,
}: CompanyUserPageProps) => {
  return (
    <div className={styles.container}>
      <Title title="Company user" />
      <div className={styles.photocontainer}>
        <div className={styles.photo}>
          {getCompany().photo !== 'none'
            ? getCompany().photo
            : getCompany().companyName.charAt(0)}
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
          content={getCompany().companyName}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Email"
          content={getCompany().email}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Phone"
          content={getCompany().phone}
          mode="view"
          isAdmin={true}
        />
        <EditableField
          index="Description"
          content={getCompany().description}
          mode="view"
          isAdmin={true}
        />
      </div>
    </div>
  )
}
