import React, { useState } from 'react'
import useFetch from 'use-http'
import { Button } from '../button'
import { IGroup, EquipmentGroupForm } from '../equipment-group-form'

export type CreateEquipmentGroupProps = {
  afterSave?: () => void
}

export const CreateEquipmentGroup: React.FC<CreateEquipmentGroupProps> = ({
  afterSave,
}: CreateEquipmentGroupProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { put } = useFetch('/modules')
  const onSave = (formValue: IGroup) => {
    put({ name: formValue.module, equipmentGroup: formValue.name }).then(() => {
      if (afterSave) afterSave()
    })
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
