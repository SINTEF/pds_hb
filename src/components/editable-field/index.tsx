import React, { useState } from 'react'
import { IconButton } from '../icon-button'

import styles from './EditableField.module.css'

export interface FieldForm {
  index: string
  content: string
}

export interface EditableFieldProps {
  index?: string

  content?: string

  mode?: 'edit' | 'view'

  editIcon?: string

  doneIcon?: string

  isAdmin: boolean // should be canEdit

  onSubmit: (formState: FieldForm) => void
}

export const EditableField: React.FC<EditableFieldProps> = ({
  index = '',
  content = '',
  mode = 'view',
  editIcon = 'edit',
  doneIcon = 'done',
  isAdmin,
  onSubmit,
}: EditableFieldProps) => {
  const [currentMode, setMode] = useState(mode)

  const [form, setForm] = useState<FieldForm>({
    index: index,
    content: content,
  })

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  if (currentMode === 'edit' && isAdmin) {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.container}>
            <label className={styles.index}>{form.index + ': '}</label>
            <input
              className={[styles.content, styles.input].join(' ')}
              type="text"
              id="content"
              value={form.content}
              onChange={onChange}
            />
          </div>
          <div className={styles.icon}>
            <IconButton
              icon={doneIcon}
              onClick={() => {
                setMode('view')
                onSubmit(form)
              }}
            />
          </div>
        </div>
        <div>
          <hr className={styles.divider} />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.container}>
            <label className={styles.index}>{form.index + ': '}</label>
            <label className={styles.content}>{form.content}</label>
          </div>
          {isAdmin && (
            <div className={styles.iconbutton}>
              <IconButton onClick={() => setMode('edit')} icon={editIcon} />
            </div>
          )}
        </div>
        <div>
          <hr className={styles.divider} />
        </div>
      </div>
    )
  }
}
