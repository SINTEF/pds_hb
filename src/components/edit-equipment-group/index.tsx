import React, { useState } from 'react'
import Ripples from 'react-ripples'
import { EquipmentGroup, EquipmentGroupForm } from '../equipment-group-form'

import styles from './EditEquipmentGroup.module.css'

export type EditEquipmentGroupProps = {
  equipmentGroup: EquipmentGroup
}

export const EditEquipmentGroup: React.FC<EditEquipmentGroupProps> = ({
  equipmentGroup,
}: EditEquipmentGroupProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const onSave = (formValue: EquipmentGroup) => {
    setModalOpen(false)
  }
  const onCancel = () => {
    setModalOpen(false)
  }

  const onDelete = () => {
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
        {...{ onSave, onCancel, onDelete }}
      />
    </>
  )
}
