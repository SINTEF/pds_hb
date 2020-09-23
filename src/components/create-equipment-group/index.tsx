import React, { useState } from 'react'
import { Button } from '../button'
import { EquipmentGroup, EquipmentGroupForm } from '../equipment-group-form'

export const CreateEquipmentGroup: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const onSave = (formValue: EquipmentGroup) => {
    setModalOpen(false)
  }
  const onCancel = () => {
    setModalOpen(false)
  }
  return (
    <>
      <Button label="Add equipment group" onClick={() => setModalOpen(true)} />
      <EquipmentGroupForm isOpen={modalOpen} {...{ onSave, onCancel }} />
    </>
  )
}
