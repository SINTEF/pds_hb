import React, { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/button'
import { IconButton } from '../../components/icon-button'
import { InputField } from '../../components/input-field'
import { SearchField } from '../../components/search-field'
import { TextBox } from '../../components/text-box'
import { Title } from '../../components/title'

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
  L3: {
    [k in L3Fields]?: string
  }
}

export type IActiveL3Form = {
  [k in L3Fields]?: boolean
}

export const AddComponentPage: FC = () => {
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
    module: groupModule,
    equipmentGroup: equipmentGroup,
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title title={`New ${equipmentGroup} component`} />
      </div>

      <div className={styles.description}>
        <TextBox
          title={'Description'}
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
          variant={'standard'}
          label="Component name"
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
          variant={'standard'}
          label="Date of revision"
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
          variant={'standard'}
          label="Remarks"
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
        <label>Add L3 properties</label>
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
                  label={L3Filter}
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
          title="Definition of DU"
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
        <Button type="danger" label="Cancel component creation" />
        <Button type="primary" label="Save new component" />
      </div>
    </div>
  )
}
