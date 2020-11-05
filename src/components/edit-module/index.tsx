import React, { useState } from 'react'
import Ripples from 'react-ripples'
import { IModule } from '../../models/module'
import { ModuleForm } from '../module-form'

import styles from './EditModule.module.css'

export type EditModuleProps = {
  equipmentModule: IModule
}

export const EditModule: React.FC<EditModuleProps> = ({
  equipmentModule,
}: EditModuleProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  // TODO: Send data to server for creation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSave = (formValue: IModule) => {
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
