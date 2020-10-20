import React, { useState } from 'react'
import { IconButton } from '../icon-button'

import styles from './EditableField.module.css'

export interface EditableFieldProps {
  /**
   * Description of the content
   */
  index?: string
  /**
   * Content of the field
   */
  content?: string
  /**
   * To switch between edit mode and view mode
   */

  mode?: 'edit' | 'view'
  /**
   * Icon for the edit button.(material.ui)
   */

  editIcon?: string
  /**
   * Icon for the done edit button.(material.ui)
   */

  doneIcon?: string

  isAdmin: boolean
}

export const EditableField: React.FC<EditableFieldProps> = ({
  index,
  content,
  mode = 'view',
  editIcon = 'edit',
  doneIcon = 'done',
  isAdmin,
}: EditableFieldProps) => {
  const [currentMode, setMode] = useState(mode)

  if (currentMode === 'edit' && isAdmin) {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.container}>
            <label className={styles.index}>{index + ': '}</label>
            <input
              className={[styles.content, styles.input].join(' ')}
              type="text"
              id="inputContent"
              placeholder={content}
            />
          </div>
          <div className={styles.icon}>
            <IconButton icon={doneIcon} onClick={() => setMode('view')} />
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
            <label className={styles.index}>{index + ': '}</label>
            <label className={styles.content}>{content}</label>
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
