import React from 'react'
import styles from './EditableField.module.css'
import IconButton from '@material-ui/core/IconButton'
import { useState } from 'react'

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

  isAdmin: boolean

  onSubmit: (formState: FieldForm) => void
}

export const EditableField: React.FC<EditableFieldProps> = ({
  index = '',
  content = '',
  mode,
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
          <div>
            <IconButton
              className={styles.icon}
              aria-label="delete"
              size="small"
              onClick={() => {
                setMode('view')
                onSubmit(form)
              }}
            >
              <i className={'material-icons ' + styles.icon}>{doneIcon}</i>
            </IconButton>
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
            <div>
              <IconButton
                className={styles.iconbutton}
                aria-label="delete"
                size="small"
                onClick={() => setMode('edit')}
              >
                <i className={'material-icons ' + styles.icon}>{editIcon}</i>
              </IconButton>
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
