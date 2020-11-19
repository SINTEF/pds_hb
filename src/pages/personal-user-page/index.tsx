import React, { useContext, useState } from 'react'

import styles from './PersonalUserPage.module.css'

import { Title } from '../../components/title'
import { EditableField, FieldForm } from '../../components/editable-field'
import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'
import useFetch from 'use-http'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

enum indexes {
  username = 'username',
  email = 'email',
  phoneNr = 'phoneNr',
}

interface IPassword {
  new_password: string
  same_password: string
}

// TO COMPLETE: Needs communication with server to save changes
export const PersonalUserPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const defaultPassword = {
    new_password: '',
    same_password: '',
  }
  const [pageState, setPage] = useState<number>(1)
  const [pswState, setPsw] = useState<IPassword>(defaultPassword)

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

  const updatePsw = async (password: IPassword) => {
    await updateData({ password: password.new_password })
  }

  const validPsw = () => {
    return (
      pswState.new_password === pswState.same_password &&
      pswState.new_password !== '' &&
      pswState.same_password !== ''
    )
  }

  const uploadImg = () => {
    return ''
  }

  const photoIcon = 'camera_alt'

  return (
    <div>
      {pageState === 1 && (
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
              {userContext.user?.username.toUpperCase().charAt(0)}
            </div>
            <i
              className={['material-icons ', styles.editphoto].join(' ')}
              onClick={uploadImg} // and update in backend
            >
              {photoIcon}
            </i>
          </div>
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
          <div className={styles.padding}>
            <EditableField // need a function prop to store the changed value so its possible to update db
              index="Username"
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
            <div className={styles.changepsw} onClick={() => setPage(2)}>
              {'Click to change password'}
            </div>
          </div>
        </div>
      )}
      {pageState === 2 && (
        <div className={[styles.container, styles.height].join(' ')}>
          <div className={styles.center}>
            <Title title="Company user" />
          </div>
          <div className={styles.padding}>
            <InputField
              label="New password"
              variant="standard"
              type="password"
              value={pswState?.new_password}
              onValueChanged={(value) =>
                setPsw({ ...pswState, new_password: value as string })
              }
            />
            <InputField
              label="Repeat new password"
              variant="standard"
              type="password"
              value={pswState?.same_password}
              onValueChanged={(value) => {
                setPsw({ ...pswState, same_password: value as string })
              }}
            />
            {validPsw() && (
              <div className={styles.button}>
                <Button
                  label={'Update password'}
                  onClick={() => {
                    updatePsw(pswState)
                    setPsw(defaultPassword)
                    setPage(1)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
