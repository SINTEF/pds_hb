import React, { useState } from 'react'
import useFetch from 'use-http'
import { IModule } from '../../models/module'
import { Button } from '../button'
import { ModuleForm } from '../module-form'

export type CreateModuleProps = {
  afterSave?: () => void
}

export const CreateModule: React.FC<CreateModuleProps> = ({
  afterSave,
}: CreateModuleProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { post } = useFetch('/modules')

  const onSave = (formValue: IModule) => {
    post({ name: formValue.name, equipmentGroups: [] }).then(() => {
      if (afterSave) afterSave()
    })
    setModalOpen(false)
  }
  const onCancel = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Button label="Add module" onClick={() => setModalOpen(true)} />
      <ModuleForm isOpen={modalOpen} {...{ onSave, onCancel }} />
    </>
  )
}
