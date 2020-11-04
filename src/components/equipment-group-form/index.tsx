import React, { useState } from 'react'
import Loader from 'react-loader-spinner'

import Modal from 'react-modal'
import useFetch from 'use-http'
import { APIResponse } from '../../models/api-response'
import { IModule } from '../../models/module'

import { Button } from '../button'
import { InputField } from '../input-field'
import { SearchField } from '../search-field'

import styles from './EquipmentGroupForm.module.css'

Modal.setAppElement(document.getElementById('root') as HTMLElement)

export interface IGroup {
  name: string
  symbol?: File
  symbolUrl?: string
  module?: string
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
    equipmentGroup ?? { name: '', symbol: undefined, module: '' }
  )

  const { data = { success: false, data: undefined }, loading } = useFetch<
    APIResponse<IModule[]>
  >('/modules', [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onCancel()}
      className={styles.content}
    >
      <h2>{equipmentGroup ? 'Edit' : 'Add'} Equipment Group</h2>
      <div className={styles.form}>
        {loading ? (
          <Loader height={24} type="Grid" color="grey" />
        ) : (
          <>
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
            <SearchField
              variant="secondary"
              suggestions={data.data?.map((module) => module.name) ?? []}
              label="Module"
              placeholder="Equipment Group module"
              onClick={(value) =>
                setFormState({ ...formState, module: value as string })
              }
              defaultValue={formState.module}
              onValueChanged={() => {
                return
              }}
            />
          </>
        )}
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
