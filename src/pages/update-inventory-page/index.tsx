import React, { useContext, useState } from 'react'
import styles from './UpdateInventoryPage.module.css'
import useFetch, { CachePolicies } from 'use-http'
import { Title } from '../../components/title'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { useHistory, useParams } from 'react-router-dom'
import { EditableField, FieldForm } from '../../components/editable-field'
import Loader from 'react-loader-spinner'
import { Button } from '../../components/button'
import MAIN_ROUTES from '../../routes/routes.constants'

export interface IUpdateInventoryInstance {
  company: string
  facility: string
  tag: string
  tagDescription?: string
  equipmentGroupL2: string
  vendor?: string
  equipmentModel?: string
  startDate: Date
  L3: {
    measuringPrinciple?: string
    designMountingPrinciple?: string
    actuationPrinciple?: string
    mediumProperties?: string
    dimension?: string
    locationEnvironment?: string
    application?: string
    diagnosticsConfiguration?: string
    testMaintenanceMonitoringStrategy?: string
  }
  created?: Date
}

export const UpdateInventoryPage: React.FC = () => {
  const history = useHistory()
  const [pageState, setPage] = useState<number>(1)
  const { inventoryInstanceId } = useParams<{ inventoryInstanceId: string }>()
  const {
    put: inventoryInstancePut,
    data: inventoryInstance,
    del: inventoryInstanceDel,
    response: inventoryInstanceResponse,
    error: inventoryInstanceError,
    loading: inventoryInstanceLoading,
  } = useFetch(
    '/inventoryInstances/' + inventoryInstanceId,
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )
  const userContext = useContext(UserContext) as IUserContext

  const handleUpdate = (form: FieldForm) => {
    const inventoryInstanceData: { [id: string]: string } = {}
    const index = form.index

    switch (index) {
      case 'Edit facility':
        inventoryInstanceData['facility'] = form.content
        break
      case 'Edit equipment group/L2':
        inventoryInstanceData['equipmentGroupL2'] = form.content
        break
      case 'Edit tag':
        inventoryInstanceData['tag'] = form.content
        break
      case 'Edit tag description':
        inventoryInstanceData['tagDescription'] = form.content
        break
      case 'Edit vendor':
        inventoryInstanceData['vendor'] = form.content
        break
      case 'Edit equipment model':
        inventoryInstanceData['equipmentModel'] = form.content
        break
    }

    inventoryInstancePut(inventoryInstanceData)
  }

  const deleteInventoryInstance = async () => {
    await inventoryInstanceDel()
    if (inventoryInstanceResponse.ok) {
      history.push(MAIN_ROUTES.INVENTORY)
    } else setPage(1)
  }

  return (
    <div>
      {inventoryInstanceLoading && !inventoryInstance ? (
        <div className={styles.loading}>
          <Loader type="Grid" color="grey" />
        </div>
      ) : (
        <>
          {pageState === 0 && (
            <div className={styles.loading}>
              <Loader type="Grid" color="grey" />
            </div>
          )}
          {userContext.user?.userGroupType === 'operator' && pageState === 1 && (
            <div className={styles.container}>
              <Title title={'Edit: '} dynamic={inventoryInstance.data.tag} />
              <div className={styles.data}>
                <EditableField
                  index="Edit facility"
                  content={inventoryInstance.data?.facility}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit equipment group/L2"
                  content={inventoryInstance.data?.equipmentGroupL2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit tag"
                  content={inventoryInstance.data?.tag}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit tag description"
                  content={inventoryInstance.data?.tagDescription}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit vendor"
                  content={inventoryInstance.data?.vendor}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit equipment model"
                  content={inventoryInstance.data?.equipmentModel}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                {/*inventoryInstance.data.sintefComment !== 'No comment' && (
                  <EditableField
                    index="SINTEF comment"
                    content={inventoryInstance.data.sintefComment}
                    isAdmin={false}
                    onSubmit={() => false}
                  />
                )*/}
                <div className={styles.button}>
                  <div
                    className={styles.back}
                    onClick={() => history.push(MAIN_ROUTES.INVENTORY)}
                  >
                    {'< Back'}
                  </div>
                  <Button
                    type="danger"
                    label="Delete"
                    size="small"
                    onClick={() => {
                      setPage(0)
                      deleteInventoryInstance()
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {userContext.user?.userGroupType === 'admin' && pageState === 1 && (
            <div className={styles.container}>
              <Title title={'Edit: '} dynamic={inventoryInstance.data.tag} />
              <div className={styles.data}>
                <EditableField
                  index="Edit facility"
                  content={inventoryInstance.data.facility}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit equipment group/L2"
                  content={inventoryInstance.data.equipmentGroupL2}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <EditableField
                  index="Edit tag"
                  content={inventoryInstance.data.tag}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit tag description"
                  content={inventoryInstance.data.tagDescription}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit vendor"
                  content={inventoryInstance.data.vendor}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />

                <EditableField
                  index="Edit equipment model"
                  content={inventoryInstance.data.equipmentModel}
                  isAdmin={true}
                  onSubmit={handleUpdate}
                />
                <div
                  className={styles.back}
                  onClick={() => history.push(MAIN_ROUTES.INVENTORY)}
                >
                  {'< Back'}
                </div>
              </div>
            </div>
          )}
          {inventoryInstanceResponse.ok ? (
            <p className={styles.responseOk}>
              {inventoryInstanceResponse.data?.message}
            </p>
          ) : null}
          {inventoryInstanceError ? (
            <p className={styles.responseError}>
              {inventoryInstanceResponse.data?.message}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
