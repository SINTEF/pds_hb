import React, { useState } from 'react'

import Modal from 'react-modal'

import { Button } from '../button'
import { InputField } from '../input-field'

import styles from './EquipmentGroupForm.module.css'

Modal.setAppElement(document.getElementById('root') as HTMLElement)

export interface IGroup {
  name: string
  symbol?: File
  symbolUrl?: string
}

export interface EquipmentGroupFormProps {
  isOpen: boolean
  onSave: (formValue: IGroup) => void
  onCancel: () => void
  onDelete?: () => void
  equipmentGroup?: IGroup
}

export const EquipmentGroupForm: React.FC<EquipmentGroupFormProps> = ({
  isOpen,
  onSave,
  onCancel,
  onDelete,
  equipmentGroup,
}: EquipmentGroupFormProps) => {
  const [formState, setFormState] = useState<IGroup>(
    equipmentGroup ?? { name: '', symbol: undefined }
  )
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onCancel()}
      className={styles.content}
    >
      <h2>{equipmentGroup ? 'Edit' : 'Add'} Equipment Group</h2>
      <div className={styles.form}>
        <InputField
          label="Name"
          variant="standard"
          type="text"
          value={formState.name}
          placeholder="Equipment group name"
          onValueChanged={(value) =>
            setFormState({ ...formState, name: value as string })
          }
        />
        <InputField
          label="Symbol"
          variant="standard"
          type="file"
          value={undefined}
          placeholder="Equipment group symbol"
          icon="add_photo_alternate"
          onValueChanged={(value) =>
            setFormState({ ...formState, symbol: (value as FileList)[0] })
          }
        />
      </div>
      <Button label="Save" onClick={() => onSave(formState)} />
      <Button
        label={equipmentGroup ? 'Delete group' : 'Cancel'}
        type="danger"
        onClick={equipmentGroup && onDelete ? onDelete : onCancel}
      />
    </Modal>
  )
}
