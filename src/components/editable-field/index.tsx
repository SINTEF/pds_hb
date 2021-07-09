import React, { useEffect, useState } from 'react'
import { IconButton } from '../icon-button'

import styles from './EditableField.module.css'

export interface FieldForm {
  index: string
  content: string
}

export interface EditableFieldProps {
  type?: 'standard' | 'comment'

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
  type = 'standard',
  isAdmin,
  onSubmit,
}: EditableFieldProps) => {
  const [currentMode, setMode] = useState(mode)

  const [form, setForm] = useState<FieldForm>({
    index: index,
    content: content,
  })

  useEffect(() => {
    setForm({ content: content, index: index })
  }, [index, content])

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  if (currentMode === 'edit' && isAdmin) {
    return (
      <div>
        <div className={styles.container}>
          {type === 'standard' ? (
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
          ) : (
            <div className={styles.container}>
              <textarea
                className={[styles.content, styles.textarea].join(' ')}
                id="content"
                value={form.content}
                onChange={onChange}
              ></textarea>
            </div>
          )}
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
        {type === 'standard' ? (
          <div>
            <hr className={styles.divider} />
          </div>
        ) : null}
      </div>
    )
  } else {
    return (
      <div>
        {isAdmin && type === 'comment' && (
          <div className={[styles.iconbutton, styles.commentIcon].join(' ')}>
            <IconButton
              onClick={() => setMode('edit')}
              icon={editIcon}
              fontSize="smaller"
            />
          </div>
        )}
        <div className={[styles.container, styles[type]].join(' ')}>
          <div className={styles.container}>
            {type === 'standard' ? (
              <label className={styles.index}>{form.index + ': '}</label>
            ) : null}
            <label className={[styles.content, styles[type]].join(' ')}>
              {form.content}
            </label>
          </div>
          {isAdmin && type === 'standard' && (
            <div className={styles.iconbutton}>
              <IconButton onClick={() => setMode('edit')} icon={editIcon} />
            </div>
          )}
        </div>
        {type === 'standard' ? (
          <div>
            <hr className={styles.divider} />
          </div>
        ) : null}
      </div>
    )
  }
}
