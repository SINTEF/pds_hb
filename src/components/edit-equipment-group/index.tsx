import React, { useState } from 'react'
import Ripples from 'react-ripples'
import useFetch from 'use-http'
import { IGroup, EquipmentGroupForm } from '../equipment-group-form'

import styles from './EditEquipmentGroup.module.css'

export type EditEquipmentGroupProps = {
  equipmentGroup: IGroup
  afterSave?: () => void
}

export const EditEquipmentGroup: React.FC<EditEquipmentGroupProps> = ({
  equipmentGroup,
  afterSave,
}: EditEquipmentGroupProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { put } = useFetch('modules/equipmentGroup')

  const onSave = (formValue: IGroup) => {
    put({
      newName: formValue.name,
      oldName: equipmentGroup.name,
      newModule: formValue.module,
      oldModule: equipmentGroup.module,
    }).then(() => {
      if (afterSave) afterSave()
    })

    setModalOpen(false)
  }
  const onCancel = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Ripples>
        <i
          className={`material-icons ${styles.icon}`}
          onClick={() => setModalOpen(true)}
        >
          create
        </i>
      </Ripples>
      <EquipmentGroupForm
        isOpen={modalOpen}
        equipmentGroup={equipmentGroup}
        {...{ onSave, onCancel }}
      />
    </>
  )
}
