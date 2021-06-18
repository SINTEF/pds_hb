import React, { useContext, useState } from 'react'
import styles from './AddInventoryPage.module.css'
import useFetch from 'use-http'
import { Title } from '../../components/title'
import { InputField } from '../../components/input-field'
import { Button } from '../../components/button'

import { UserContext } from '../../utils/context/userContext'
import { IUserContext } from '../../models/user'

import { useHistory } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

import * as XLSX from 'xlsx'
import { RegisteredDataField } from '../../components/registered-data-field'

export interface Form {
  company: string | undefined
  facility: string | null
  tag: string | null
  equipmentGroupL2: string | null
  vendor: string | null
  equipmentModel: string | null
  startDate: Date
  L3: Record<string, string> | null
}

export const AddInventoryPage: React.FC = () => {
  const history = useHistory()
  const { post } = useFetch()

  const userContext = useContext(UserContext) as IUserContext

  const [pageState, setPage] = useState<number>(1)

  const [dataState, setData] = useState<Form>({
    company: undefined,
    facility: null,
    startDate: new Date(),
    equipmentGroupL2: null,
    tag: null,
    vendor: null,
    equipmentModel: null,
    L3: {},
  })

  const [inventory, setInventory] = useState<Array<Form>>([])

  const readExcel = (file: File) => {
    const promise = new Promise(
      (resolve: (value: Array<Form>) => void, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)

        fileReader.onload = (e) => {
          if (e.target !== null) {
            const bufferArray = e.target.result

            const workBook = XLSX.read(bufferArray, { type: 'buffer' })

            const workSheetname = workBook.SheetNames[0]

            const workSheet = workBook.Sheets[workSheetname]

            const data = XLSX.utils.sheet_to_json(workSheet)

            //eslint-disable-next-line
            data.forEach((d: any) => {
              d = {
                company: undefined,
                facility: (d['Facility'] ?? '') as string,
                startDate:
                  new Date(Date.UTC(0, 0, d['Date put into service'], -25)) ??
                  new Date(), //must be changed if hours is important as it does not concider summer time
                equipmentGroupL2: (d['Eq. Group L2'] ?? '') as string,
                tag: (d['Tag no./FL'] ?? '') as string,
                vendor: (d['Vendor'] ?? '') as string,
                equipmentModel: (d['Eq. Model'] ?? '') as string,
                L3: null,
              } as Form
              setInventory((inventoryInstance) => [...inventoryInstance, d])
            })

            resolve(inventory)
          }
        }

        fileReader.onerror = (error) => {
          setInventory([])
          reject(error)
        }
      }
    )

    promise.then(() => {
      //setInventory(d)
    })
  }

  const valid_inventoryInstance = () => {
    return (
      dataState.facility &&
      dataState.startDate &&
      dataState.tag &&
      dataState.equipmentGroupL2
    )
  }

  const valid_inventoryInstances = () => {
    return inventory.every(
      (inventoryInstance) =>
        inventoryInstance.facility &&
        inventoryInstance.startDate &&
        inventoryInstance.tag &&
        inventoryInstance.equipmentGroupL2
    )
  }

  const hasFacility = () => {
    return inventory.every((inventoryInstance) => inventoryInstance.facility)
  }

  const hasDate = () => {
    return inventory.every((inventoryInstance) => inventoryInstance.startDate)
  }

  const hasEqGroup = () => {
    return inventory.every(
      (inventoryInstance) => inventoryInstance.equipmentGroupL2
    )
  }

  const hasTag = () => {
    return inventory.every((inventoryInstance) => inventoryInstance.tag)
  }

  const updateData = async (form: Form): Promise<void> => {
    form = { ...form, company: userContext.user?.companyName }

    await post('/inventoryInstances/', form)
  }

  const updateMultipleInventoryInstances = () => {
    inventory.map((inventoryInstance) => updateData(inventoryInstance))
  }

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <Title title={'Add inventory data'} />
        </div>
        <div
          className={[styles.container, styles.firstpagebuttoncontainer].join(
            ' '
          )}
        >
          <InputField
            variant="primary"
            type="file"
            label="Upload file"
            value=" "
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            //data-max-size="2048"
            onValueChanged={(e) => {
              const file = (e as FileList)[0]
              readExcel(file)
              setPage(2)
            }}
          />

          <Button
            label={'Add inventory data manually'}
            onClick={() => {
              setData({
                ...dataState,
                company: dataState.company,
                facility: null,
                startDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                vendor: null,
                equipmentModel: null,
                L3: null,
              })
              setPage(3)
            }}
          />
        </div>
      </div>
    )
  } else if (pageState === 2) {
    return (
      <div className={styles.inventorycontainer}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setInventory([])
          }}
        >
          {'< Back'}
        </div>
        <div className={styles.center}>
          <Title title={'Preview'} />
        </div>
        <div className={styles.previewpagebuttoncontainer}>
          {valid_inventoryInstances() && (
            <Button
              label="Save"
              size="small"
              onClick={() => {
                updateMultipleInventoryInstances()
                setPage(4)
              }}
            />
          )}
          {!valid_inventoryInstances() && (
            <div className={styles.infotext}>
              Some of your inventory instances are missing required data!
            </div>
          )}
        </div>
        <div className={styles.table}>
          <div>
            <table className={styles.headers}>
              <tbody>
                <tr>
                  <td className={hasFacility() ? undefined : styles.required}>
                    {'Facility'}
                  </td>
                  <td className={hasDate() ? undefined : styles.required}>
                    {'Date put into service'}
                  </td>
                  <td className={hasEqGroup() ? undefined : styles.required}>
                    {'Equipment group L2'}
                  </td>
                  <td className={hasTag() ? undefined : styles.required}>
                    {'Tag'}
                  </td>
                  <td>{'Vendor'}</td>
                  <td>{'Eq. Model'}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {inventory?.map((inventoryInstance, key) => (
          <RegisteredDataField key={key}>
            <label className={styles.fontSize}>
              {inventoryInstance.facility}
            </label>
            <label className={styles.fontSize}>
              {new Date(
                inventoryInstance.startDate as Date
              ).toLocaleDateString()}
            </label>
            <label className={styles.fontSize}>
              {inventoryInstance.equipmentGroupL2}
            </label>
            <label className={styles.fontSize}>{inventoryInstance.tag}</label>
            <label className={styles.fontSize}>
              {inventoryInstance.vendor}
            </label>
            <label className={styles.fontSize}>
              {inventoryInstance.equipmentModel}
            </label>
            <i
              onClick={() => false}
              className={'material-icons ' + styles.icon}
            >
              {'editor'}
            </i>
          </RegisteredDataField>
        ))}
      </div>
    )
  } else if (pageState === 3) {
    return (
      <div className={styles.container}>
        <div
          className={styles.back}
          onClick={() => {
            setPage(1)
            setInventory([])
          }}
        >
          {'< Back'}
        </div>
        <Title title={'Add inventory'} />
        <div className={styles.data}>
          <InputField
            variant="standard"
            type="text"
            label="facility*"
            placeholder={
              dataState.facility ? undefined : 'Type in facility name number...'
            }
            value={dataState.facility ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, facility: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="date"
            label="date*"
            placeholder={dataState.startDate ? undefined : 'dd-mm-yyyy...'}
            value={dataState.startDate}
            onValueChanged={(value) => {
              setData({ ...dataState, startDate: value as Date })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="equipment group L2*"
            placeholder={
              dataState.equipmentGroupL2
                ? undefined
                : 'Type in equipment group...'
            }
            value={dataState.equipmentGroupL2 ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, equipmentGroupL2: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="tag*"
            placeholder={dataState.tag ? undefined : 'Type in tag...'}
            value={dataState.tag ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, tag: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="vendor"
            placeholder={
              dataState.vendor ? undefined : 'Provide vendor name...'
            }
            value={dataState.vendor ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, vendor: value as string })
            }}
          />
          <InputField
            variant="standard"
            type="text"
            label="Eq. Model"
            placeholder={
              dataState.equipmentModel
                ? undefined
                : 'Provide a longer description...'
            }
            value={dataState.equipmentModel ?? undefined}
            onValueChanged={(value) => {
              setData({ ...dataState, equipmentModel: value as string })
            }}
          />
        </div>
        {!valid_inventoryInstance() && (
          <div className={styles.infotext}>Missing required fields *</div>
        )}
        {valid_inventoryInstance() && (
          <div className={styles.button}>
            <Button
              onClick={() => {
                setPage(4)
                updateData(dataState)
              }}
              label="Add data"
            />
          </div>
        )}
      </div>
    )
  } else if (pageState === 4) {
    return (
      <div className={styles.container}>
        <Title title={'Add inventory'} />
        <div className={[styles.container, styles.buttoncontainer].join(' ')}>
          {'Inventory successfully added!'}
          <Button
            label={'Add more inventory instances'}
            onClick={() => {
              setData({
                ...dataState,
                company: dataState.company,
                facility: null,
                startDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                vendor: null,
                equipmentModel: null,
                L3: {},
              })
              setPage(1)
            }}
          />
          <Button
            label={'See all registered data'}
            onClick={() => {
              history.push(MAIN_ROUTES.INVENTORY)
              setData({
                ...dataState,
                company: dataState.company,
                facility: null,
                startDate: new Date(),
                equipmentGroupL2: null,
                tag: null,
                vendor: null,
                equipmentModel: null,
                L3: {},
              })
            }}
          />
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
