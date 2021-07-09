import styles from './InventoryPage.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch, { CachePolicies } from 'use-http'
import MAIN_ROUTES from '../../routes/routes.constants'

import { Title } from '../../components/title'
import { APIResponse } from '../../models/api-response'
import { RegisteredDataField } from '../../components/registered-data-field'
import { IUserContext } from '../../models/user'
import { UserContext } from '../../utils/context/userContext'
import { Button } from '../../components/button'
import { IInventoryInstance } from '../../models/inventoryinstance'
import { Filter } from '../../components/filter'
import Loader from 'react-loader-spinner'
import { SearchField } from '../../components/search-field'

export const InventoryPage: React.FC = () => {
  const userContext = useContext(UserContext) as IUserContext
  const [inventory, setInventory] = useState<IInventoryInstance[]>([])
  const [viewedInventory, setView] = useState<IInventoryInstance[]>([])
  const history = useHistory()
  const [tags, setTags] = useState<IInventoryInstance[]>([])
  const [equipmentGroups, setEquipmentGroups] = useState<
    Record<string, boolean>
  >({})

  const {
    get: inventoryInstanceGet,
    response: inventoryInstanceResponse,
    loading: inventoryInstanceLoad,
  } = useFetch<APIResponse<IInventoryInstance>>(
    '/inventoryInstances',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const getInventory = async () => {
      const dataRequest = `?company=${userContext.user?.companyName}`
      const inventoryData: APIResponse<
        IInventoryInstance[]
      > = await inventoryInstanceGet(dataRequest)
      if (inventoryInstanceResponse.ok) {
        setInventory(inventoryData.data)
        setView(inventoryData.data)
        setEquipmentGroups(
          Object.entries(inventoryData.data)
            .map((inventoryInstance) => inventoryInstance[1].equipmentGroupL2)
            .reduce((obj, name) => ({ ...obj, [name]: false }), {})
        )
      }
    }
    getInventory()
  }, [inventoryInstanceGet, inventoryInstanceResponse, userContext.user])

  useEffect(() => {
    setTags(inventory)
  }, [inventory])

  useEffect(() => {
    const eqFilters = Object.entries(equipmentGroups)
      .filter((group) => group[1])
      .flatMap(([key]) => key)

    setView(
      tags.filter(
        (inventoryInstance) =>
          eqFilters.length < 1 ||
          eqFilters.includes(inventoryInstance.equipmentGroupL2)
      )
    )

    if (eqFilters.length < 1) {
      setView(tags)
    }
  }, [equipmentGroups, tags])

  return inventoryInstanceLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.center}>
        <Title title="Inventory" />
      </div>
      <div className={styles.menucontainer}>
        <div className={styles.filtercontainer}>
          <Filter
            category="Equipment group L2"
            filters={equipmentGroups}
            onClick={(selected, newValue) => {
              setEquipmentGroups({
                ...equipmentGroups,
                [selected]: newValue,
              })
            }}
            key={'equipmentGroupL2'}
          />
          <SearchField
            variant="small"
            label={'Tag'}
            icon={'search'}
            placeholder="Search for tags..."
            suggestions={[]}
            onValueChanged={(value) =>
              setTags(
                inventory.filter((inventoryInstance) =>
                  inventoryInstance.tag
                    .toLowerCase()
                    .includes(value.toLowerCase())
                )
              )
            }
            onClick={() => false}
          />
        </div>
        <div className={styles.buttoncontainer}>
          <Button
            label={'Add more inventory'}
            size="small"
            onClick={() => history.push(MAIN_ROUTES.ADD_INVENTORY)}
          />
        </div>
      </div>
      <div className={styles.inventorycontainer}>
        <div className={styles.table}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td>{'Facility'}</td>
                  <td>{'Date'}</td>
                  <td>{'Equipment group L2'}</td>
                  <td>{'Tag'}</td>
                  <td>{'Tag description'}</td>
                  <td>{'Vendor'}</td>
                  <td>{'Equipment model'}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          {viewedInventory?.map((data, key) => (
            <RegisteredDataField key={key}>
              <label className={styles.fontSize}>{data.facility}</label>
              <label className={styles.fontSize}>
                {new Date(data.startDate as Date).toLocaleDateString()}
              </label>
              <label className={styles.fontSize}>{data.equipmentGroupL2}</label>
              <label className={styles.fontSize}>{data.tag}</label>
              <label className={styles.fontSize}>{data.tagDescription}</label>
              <label className={styles.fontSize}>{data.vendor}</label>
              <label className={styles.fontSize}>{data.equipmentModel}</label>
              <i
                onClick={() =>
                  history.push(
                    MAIN_ROUTES.EDIT_INVENTORY.replace(
                      ':inventoryInstanceId',
                      data._id.replace(' ', '+')
                    )
                  )
                }
                className={'material-icons ' + styles.icon}
              >
                {'editor'}
              </i>
            </RegisteredDataField>
          ))}
        </div>
      </div>
    </div>
  )
}
