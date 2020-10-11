import React, { useState } from 'react'
import { Button } from '../button'
import { IGroup, EquipmentGroupForm } from '../equipment-group-form'

export const CreateEquipmentGroup: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  // TODO: Send data to server for creation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSave = (formValue: IGroup) => {
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
