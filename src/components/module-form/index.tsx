import React, { useState } from 'react'

import Modal from 'react-modal'
import { IModule } from '../../models/module'

import { Button } from '../button'
import { InputField } from '../input-field'

import styles from './ModuleForm.module.css'

Modal.setAppElement(document.getElementById('root') as HTMLElement)

export interface ModuleFormProps {
  isOpen: boolean
  onSave: (formValue: IModule) => void
  onCancel: () => void
  equipmentModule?: IModule
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  isOpen,
  onSave,
  onCancel,
  equipmentModule,
}: ModuleFormProps) => {
  const [formState, setFormState] = useState<IModule>(
    equipmentModule ?? { name: '', equipmentGroups: [] }
  )

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onCancel()}
      className={styles.content}
    >
      <h2>{equipmentModule ? 'Edit' : 'Add'} Module</h2>
      <div className={styles.form}>
        <>
          <InputField
            label="Name"
            variant="standard"
            type="text"
            value={formState.name}
            placeholder="Module name"
            onValueChanged={(value) =>
              setFormState({ ...formState, name: value as string })
            }
          />
        </>
      </div>
      <Button label="Save" onClick={() => onSave(formState)} />
      <Button label="Cancel" type="danger" onClick={() => onCancel()} />
    </Modal>
  )
}
