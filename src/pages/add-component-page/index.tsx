import React, { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { SearchField } from '../../components/search-field'
import { TextBox } from '../../components/text-box'
import { Title } from '../../components/title'

import styles from './AddComponentPage.module.css'

export interface IComponentInfoForm {
  name: string
  revisionDate: Date
  remarks: string
  description: string
  module: string
  equipmentGroup: string
  definitionOfDU: string
  L3: {
    measuringPrinciple: string
    designMountingPrinciple: string
    actuationPrinciple: string
    mediumProperties: string
    dimension: string
    locationEnvironment: string
    application: string
    diagnosticsConfiguration: string
    testMaintenanceMonitoringStrategy: string
  }
}

export interface IActiveL3Form {
  measuringPrinciple: boolean
  designMountingPrinciple: boolean
  actuationPrinciple: boolean
  mediumProperties: boolean
  dimension: boolean
  locationEnvironment: boolean
  application: boolean
  diagnosticsConfiguration: boolean
  testMaintenanceMonitoringStrategy: boolean
}

export const AddComponentPage: FC = () => {
  const { equipmentGroup } = useParams<{ equipmentGroup: string }>()

  const [componentInfoForm, setComponentInfoForm] = useState<
    IComponentInfoForm
  >({
    name: '',
    revisionDate: new Date(),
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
        <SearchField
          variant="secondary"
          label="Add L3 field"
          suggestions={Object.keys(activeL3Fields)}
          onClick={(value) =>
            setActiveL3Fields({ ...activeL3Fields, [value]: true })
          }
        />
        {Object.keys(componentInfoForm.L3)
          .filter((L3Filter) => activeL3Fields[L3Filter])
          .map((L3Filter) => (
            <InputField
              key={L3Filter}
              variant="standard"
              label={L3Filter}
              value={componentInfoForm.L3[L3Filter]}
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
