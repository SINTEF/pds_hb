import React, { useState } from 'react'
import { IconButton } from '../icon-button'
import styles from './TextBox.module.css'

export interface TextBoxProps {
  title: string

  content: string

  size: 'large' | 'small'

  icon?: string

  isAdmin?: boolean

  onValueChanged?: (newValue: string) => void

  edit?: boolean
}

export const TextBox: React.FC<TextBoxProps> = ({
  title,
  content,
  size,
  icon = 'create',
  isAdmin = false,
  edit = false,
  onValueChanged = (val) => {
    return val
  },
}: TextBoxProps) => {
  const [editStatus, setEdit] = useState<boolean>(edit)

  return (
    <div className={[styles.container, styles[size]].join(' ')}>
      <div className={styles.head}>
        <div className={styles.titlecontainer}>
          {title}
          <hr className={styles.line} />
        </div>
        {isAdmin && (
          <div className={styles.icon}>
            <IconButton
              icon={editStatus ? 'check' : icon}
              onClick={() => setEdit(!editStatus)}
            />
          </div>
        )}
      </div>
      {editStatus ? (
        <textarea
          value={content}
          onChange={(newValue) => onValueChanged(newValue.target.value)}
          placeholder={'Write something here...'}
        ></textarea>
      ) : (
        <p>{content}</p>
      )}
    </div>
  )
}
