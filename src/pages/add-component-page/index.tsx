import React, { FC, useMemo, useState } from 'react'
import Loader from 'react-loader-spinner'
import { useHistory, useParams } from 'react-router-dom'
import useFetch from 'use-http'
import Modal from 'react-modal'

import { Button } from '../../components/button'
import { IconButton } from '../../components/icon-button'
import { InputField } from '../../components/input-field'
import { SearchField } from '../../components/search-field'
import { TextBox } from '../../components/text-box'
import { Title } from '../../components/title'
import { IDataInstance } from '../../models/datainstance'
import MAIN_ROUTES from '../../routes/routes.constants'
import { formatCamelCase } from '../../utils/casing'

import styles from './AddComponentPage.module.css'

type L3Fields =
  | 'measuringPrinciple'
  | 'designMountingPrinciple'
  | 'actuationPrinciple'
  | 'mediumProperties'
  | 'dimension'
  | 'locationEnvironment'
  | 'application'
  | 'diagnosticsConfiguration'
  | 'testMaintenanceMonitoringStrategy'

export interface IComponentInfoForm {
  name: string
  revisionDate: Date | undefined
  remarks: string
  description: string
  module: string
  equipmentGroup: string
  definitionOfDU: string
  L3: Record<L3Fields, string>

  data: IDataInstance[]
}

export type IActiveL3Form = Record<L3Fields, boolean>

export const AddComponentPage: FC = () => {
  const history = useHistory()

  const { groupModule, equipmentGroup } = useParams<{
    groupModule: string
    equipmentGroup: string
  }>()

  const [componentInfoForm, setComponentInfoForm] = useState<
    IComponentInfoForm
  >({
    name: '',
    revisionDate: undefined,
    remarks: '',
    description: '',
    module: '',
    equipmentGroup: '',
    definitionOfDU: '',
    L3: {
      measuringPrinciple: '',
      designMountingPrinciple: '',
      actuationPrinciple: '',
      mediumProperties: '',
      dimension: '',
      locationEnvironment: '',
      application: '',
      diagnosticsConfiguration: '',
      testMaintenanceMonitoringStrategy: '',
    },
    data: [],
  })

  const [activeL3Fields, setActiveL3Fields] = useState<IActiveL3Form>({
    measuringPrinciple: false,
    designMountingPrinciple: false,
    actuationPrinciple: false,
    mediumProperties: false,
    dimension: false,
    locationEnvironment: false,
    application: false,
    diagnosticsConfiguration: false,
    testMaintenanceMonitoringStrategy: false,
  })

  const [L3SearchFieldState, setL3SearchFieldState] = useState<string>('')

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { post, response, loading, error } = useFetch('/components')

  const createComponent = async () => {
    if (!formIsValid) {
      return
    }
    const componentCopy: IComponentInfoForm = JSON.parse(
      JSON.stringify(componentInfoForm)
    )
    componentCopy.module = groupModule.replace('+', ' ')
    componentCopy.equipmentGroup = equipmentGroup.replace('+', ' ')
    removeEmpty(componentCopy.L3)
    createArrayFromL3Params(componentCopy.L3)

    await post(componentCopy)
    if (response.ok) {
      setModalOpen(true)
    }
  }

  const removeEmpty = (obj: Record<string, string | string[]>) => {
    Object.keys(obj).forEach((key) => obj[key] === '' && delete obj[key])
  }

  const createArrayFromL3Params = (obj: Record<string, string | string[]>) => {
    Object.keys(obj).forEach(
      (key) =>
        (obj[key] = (obj[key] as string)
          .split(',')
          .map((element: string) => element.trim()))
    )
  }

  const formIsValid = useMemo(() => {
    return (
      componentInfoForm.name &&
      componentInfoForm.revisionDate &&
      componentInfoForm.remarks &&
      componentInfoForm.description &&
      Object.entries(componentInfoForm.L3).some(([, value]) => !!value)
    )
  }, [
    componentInfoForm.name,
    componentInfoForm.revisionDate,
    componentInfoForm.remarks,
    componentInfoForm.description,
    componentInfoForm.L3,
  ])

  const unSetL3Field = (L3Filter: string) => {
    setActiveL3Fields({
      ...activeL3Fields,
      [L3Filter]: false,
    })
    setComponentInfoForm({
      ...componentInfoForm,
      L3: {
        ...componentInfoForm.L3,
        [L3Filter]: '',
      },
    })
  }

  const resetForm = () => {
    setComponentInfoForm({
      name: '',
      revisionDate: undefined,
      remarks: '',
      description: '',
      module: '',
      equipmentGroup: '',
      definitionOfDU: '',
      L3: {
        measuringPrinciple: '',
        designMountingPrinciple: '',
        actuationPrinciple: '',
        mediumProperties: '',
        dimension: '',
        locationEnvironment: '',
        application: '',
        diagnosticsConfiguration: '',
        testMaintenanceMonitoringStrategy: '',
      },
      data: [],
    })

    setActiveL3Fields({
      measuringPrinciple: false,
      designMountingPrinciple: false,
      actuationPrinciple: false,
      mediumProperties: false,
      dimension: false,
      locationEnvironment: false,
      application: false,
      diagnosticsConfiguration: false,
      testMaintenanceMonitoringStrategy: false,
    })

    setModalOpen(false)
  }

  return (
    <div className={styles.container}>
      <Modal
        isOpen={modalOpen}
        style={{
          content: {
            margin: '20vh 20vw',
          },
          overlay: {
            zIndex: 100,
          },
        }}
      >
        <div className={styles.modalContent}>
          <p>Component successfully added!</p>
          <div>
            <Button label="Add another component" onClick={() => resetForm()} />
            <Button
              label="Return to browse page"
              onClick={() => history.push(MAIN_ROUTES.BROWSE)}
            />
          </div>
        </div>
      </Modal>
      <div className={styles.title}>
        <Title title={`New ${equipmentGroup.replace('+', ' ')} component`} />
      </div>

      <div className={styles.description}>
        <TextBox
          title={'Description*'}
          edit={true}
          content={componentInfoForm.description}
          onValueChanged={(description) =>
            setComponentInfoForm({ ...componentInfoForm, description })
          }
          size="large"
        />
      </div>
      <div className={styles.inputfields}>
        <InputField
          variant="standard"
          label="Component name*"
          placeholder="Chose a component name"
          value={componentInfoForm.name}
          onValueChanged={(value) =>
            setComponentInfoForm({
              ...componentInfoForm,
              name: value as string,
            })
          }
        />
        <InputField
          variant="standard"
          label="Date of revision*"
          placeholder="dd.mm.yyyy"
          type="date"
          value={componentInfoForm.revisionDate}
          onValueChanged={(value) =>
            setComponentInfoForm({
              ...componentInfoForm,
              revisionDate: value as Date,
            })
          }
        />
        <InputField
          variant="standard"
          label="Remarks*"
          placeholder="Add a remark"
          value={componentInfoForm.remarks}
          onValueChanged={(value) =>
            setComponentInfoForm({
              ...componentInfoForm,
              remarks: value as string,
            })
          }
        />
      </div>
      <div className={styles.L3}>
        <label>Add L3 properties*</label>
        <SearchField
          variant="primary"
          icon="list"
          placeholder="Search..."
          suggestions={Object.entries(activeL3Fields)
            .filter(([, value]) => !value)
            .map(([key]) => key)}
          allowAllInputs={true}
          onClick={(value) => {
            setActiveL3Fields({ ...activeL3Fields, [value]: true })
            setL3SearchFieldState('')
          }}
          value={L3SearchFieldState}
          onValueChanged={(value) => setL3SearchFieldState(value)}
        />
        {Object.entries(activeL3Fields)
          .filter(([, value]) => value)
          .map(([L3Filter]) => (
            <div key={L3Filter} className={styles.L3Field}>
              <div className={styles.L3Input}>
                <InputField
                  variant="standard"
                  label={formatCamelCase(L3Filter)}
                  value={componentInfoForm.L3[L3Filter as L3Fields]}
                  placeholder="Input possible values as list separated by commas"
                  onValueChanged={(value) => {
                    setComponentInfoForm({
                      ...componentInfoForm,
                      L3: {
                        ...componentInfoForm.L3,
                        [L3Filter]: value as string,
                      },
                    })
                  }}
                />
              </div>
              <div className={styles.L3Button}>
                <IconButton
                  icon="delete"
                  onClick={() => unSetL3Field(L3Filter)}
                />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.definition}>
        <TextBox
          title="Definition of DU*"
          edit={true}
          content={componentInfoForm.definitionOfDU}
          onValueChanged={(value) =>
            setComponentInfoForm({
              ...componentInfoForm,
              definitionOfDU: value as string,
            })
          }
          size="large"
        />
      </div>
      <div className={styles.buttons}>
        <Button
          type="danger"
          label="Cancel component creation"
          onClick={() => history.push(MAIN_ROUTES.BROWSE)}
        />
        <div className={styles.feedbackGroup}>
          <Loader height={24} type="Grid" color="grey" visible={loading} />
          {error ? (
            <p>
              {response.data?.message ??
                "Hmm. Doesn't look like we can connect to the server. Try again later."}
            </p>
          ) : null}
          <Button
            type="primary"
            label="Save new component"
            onClick={() => createComponent()}
          />
        </div>
      </div>
    </div>
  )
}
