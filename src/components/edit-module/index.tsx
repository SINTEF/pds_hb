import React, { useState } from 'react'
import Ripples from 'react-ripples'
import useFetch from 'use-http'
import { IModule } from '../../models/module'
import { ModuleForm } from '../module-form'

import styles from './EditModule.module.css'

export type EditModuleProps = {
  equipmentModule: IModule
  afterSave?: () => void
}

export const EditModule: React.FC<EditModuleProps> = ({
  equipmentModule,
  afterSave,
}: EditModuleProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { put } = useFetch('modules/rename')

  const onSave = (formValue: IModule) => {
    put({
      oldName: equipmentModule.name,
      newName: formValue.name,
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
      <ModuleForm
        isOpen={modalOpen}
        equipmentModule={equipmentModule}
        {...{ onSave, onCancel }}
      />
    </>
  )
}
