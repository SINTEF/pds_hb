import React from 'react'
import styles from './EditableField.module.css'
import IconButton from '@material-ui/core/IconButton'
import { useState } from 'react'

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
}

export const EditableField: React.FC<EditableFieldProps> = ({
  index,
  content,
  mode,
  editIcon = 'edit',
  doneIcon = 'done',
}: EditableFieldProps) => {
  const [currentMode, setMode] = useState(mode)

  if (currentMode === 'edit') {
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
          <div>
            <IconButton
              className={styles.icon}
              aria-label="delete"
              size="small"
              onClick={() => setMode('view')}
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
            <label className={styles.index}>{index + ': '}</label>
            <label className={styles.content}>{content}</label>
          </div>
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
        </div>
        <div>
          <hr className={styles.divider} />
        </div>
      </div>
    )
  }
}
