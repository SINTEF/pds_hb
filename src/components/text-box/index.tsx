import React from 'react'
import styles from './TextBox.module.css'

export interface TextBoxProps {
  title: string

  content: string

  size: 'large' | 'small'

  icon?: string

  isAdmin?: boolean
}

export const TextBox: React.FC<TextBoxProps> = ({
  title,
  content,
  size,
  icon = 'editor',
  isAdmin = false,
}: TextBoxProps) => {
  return (
    <div className={[styles.container, styles[size]].join(' ')}>
      {isAdmin && (
        <div className={['material-icons', styles.icon].join(' ')}>{icon}</div>
      )}
      <div className={styles.titlecontainer}>
        {title}
        <hr className={styles.line} />
      </div>
      <div>{content}</div>
    </div>
  )
}
