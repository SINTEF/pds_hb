import React from 'react'
import styles from './TextBox.module.css'

export interface TextBoxProps {
  title: string

  content: string

  size: 'large' | 'small'
}

export const TextBox: React.FC<TextBoxProps> = ({
  title,
  content,
  size,
}: TextBoxProps) => {
  return (
    <div className={[styles.container, styles[size]].join(' ')}>
      <div className={styles.titlecontainer}>
        {title}
        <hr className={styles.line} />
      </div>
      <div>{content}</div>
    </div>
  )
}
