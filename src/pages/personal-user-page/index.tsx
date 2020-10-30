import React, { useContext } from 'react'

import styles from './PersonalUserPage.module.css'

import { Title } from '../../components/title'
import { EditableField, FieldForm } from '../../components/editable-field'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import useFetch from 'use-http'

enum indexes {
  username = 'username',
  email = 'email',
  phoneNr = 'phoneNr',
}

// TO COMPLETE: Needs communication with server to save changes
export const PersonalUserPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext

  const {
    put: updateData,
    response: updateDataResponse,
    error: updateDataError,
  } = useFetch('/user/' + userContext.user?.username)

  const handleUpdate = (form: FieldForm) => {
    const data: { [id: string]: string } = {}
    const index = form.index

    switch (index) {
      case 'Name':
        data[indexes.username] = form.content
        break
      case 'Phone':
        data[indexes.phoneNr] = form.content
        break
      case 'Email':
        data[indexes.email] = form.content
        break
    }

    updateData(data)
  }

  const uploadImg = () => {
    return ''
  }

  const photoIcon = 'camera_alt'

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Company user" />
      </div>
      {/*
        <div className={styles.photocontainer}>
          <div className={styles.photo}>

            {userContext.user?.photo
              ? userContext.user?.photo
            : userContext.user?.username.charAt(0)}
          </div>
          
          <i
            className={['material-icons ', styles.editphoto].join(' ')}
            onClick={uploadImg} // and update in backend
          >
            {photoIcon}
          </i>
        </div>
        */}
      <div className={[styles.photocontainer, styles.center].join(' ')}>
        <div className={styles.photo}>
          {userContext.user?.username.charAt(0)}
        </div>
        <i
          className={['material-icons ', styles.editphoto].join(' ')}
          onClick={uploadImg} // and update in backend
        >
          {photoIcon}
        </i>
      </div>
      <div className={styles.padding}>
        <EditableField // need a function prop to store the changed value so its possible to update db
          index="Name"
          content={userContext.user?.username}
          mode="view"
          isAdmin={true}
          onSubmit={handleUpdate}
        />
        <EditableField
          index="Email"
          content={userContext.user?.email}
          mode="view"
          isAdmin={true}
          onSubmit={handleUpdate}
        />
        <EditableField
          index="Phone"
          content={userContext.user?.phoneNr}
          mode="view"
          isAdmin={true}
          onSubmit={handleUpdate}
        />
        <EditableField
          index="Subscription type"
          content={userContext.user?.userGroupType.replace('_', ' ')}
          mode="view"
          isAdmin={false}
          onSubmit={() => {
            return false
          }}
        />
        {(userContext.user?.userGroupType === 'admin' ||
          userContext.user?.userGroupType === 'operator') && (
          <EditableField
            index="Company"
            content={userContext.user?.companyName}
            mode="view"
            isAdmin={false}
            onSubmit={() => {
              return false
            }}
          />
        )}
        {updateDataResponse.ok ? (
          <p className={styles.responseOk}>
            {updateDataResponse.data?.message}
          </p>
        ) : null}
        {updateDataError ? (
          <p className={styles.responseError}>
            {updateDataResponse.data?.message}
          </p>
        ) : null}
      </div>
    </div>
  )
}
