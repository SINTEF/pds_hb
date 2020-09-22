import React, { useState } from 'react'

import Modal from 'react-modal'

import { Button } from '../button'
import { InputField } from '../input-field'

import styles from './EquipmentGroupForm.module.css'

Modal.setAppElement('#root')

export interface EquipmentGroup {
  id: string
  name: string
  symbol?: File
}

export interface EquipmentGroupFormProps {
  isOpen: boolean
  onSave: (formValue: EquipmentGroup) => void
  onCancel: () => void
  equipmentGroup?: EquipmentGroup
}

export const EquipmentGroupForm: React.FC<EquipmentGroupFormProps> = ({
  isOpen,
  onSave,
  onCancel,
  equipmentGroup,
}: EquipmentGroupFormProps) => {
  const [formState, setFormState] = useState(
    equipmentGroup ?? { id: '', name: '', symbol: undefined }
  )
  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: {
          width: '60vw',
          minWidth: '750px',
          maxHeight: '552px',
          margin: 'auto auto',
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <h2>Equipment group</h2>
      <div className={styles.form}>
        <InputField
          label="Name"
          variant="standard"
          type="text"
          defaultValue=""
          placeholder="Equipment group name"
          onValueChanged={(value) =>
            setFormState({ ...formState, name: value as string })
          }
        />
        <InputField
          label="Symbol"
          variant="standard"
          type="file"
          defaultValue=""
          placeholder="Equipment group symbol"
          icon="add_photo_alternate"
          onValueChanged={(value) =>
            setFormState({ ...formState, symbol: (value as FileList)[0] })
          }
        />
        <Button label="Save" onClick={() => onSave(formState)} />
        <Button
          label={equipmentGroup ? 'Delete group' : 'Cancel'}
          type="danger"
          onClick={onCancel}
        />
      </div>
    </Modal>
  )
}
