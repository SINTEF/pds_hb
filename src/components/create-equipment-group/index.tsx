import React, { useState } from 'react'
import useFetch from 'use-http'
import { Button } from '../button'
import { IGroup, EquipmentGroupForm } from '../equipment-group-form'

export const CreateEquipmentGroup: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { put } = useFetch('/modules')
  // TODO: Send data to server for creation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSave = (formValue: IGroup) => {
    put({ name: formValue.module, equipmentGroup: formValue.name })
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
