import React, { useState } from 'react'
import useFetch from 'use-http'
import { IModule } from '../../models/module'
import { Button } from '../button'
import { ModuleForm } from '../module-form'

export const CreateModule: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { post } = useFetch('/modules')
  // TODO: Send data to server for creation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSave = (formValue: IModule) => {
    post({ name: formValue.name, equipmentGroups: [] })
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
