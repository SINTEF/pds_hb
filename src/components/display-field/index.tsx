import React from 'react'
import styles from './DisplayField.module.css'

export interface DisplayFieldProps {
  /**
   * Description of the content
   */
  index: string
  /**
   * Content of the field
   */
  content: string
}

export const DisplayField: React.FC<DisplayFieldProps> = ({
  index,
  content,
}: DisplayFieldProps) => {
  return (
    <div>
      <div className={styles.container}>
        <label className={styles.index}>{index + ': '}</label>
        <label className={styles.content}>{content}</label>
      </div>
      <div>
        <hr className={styles.divider} />
      </div>
    </div>
  )
}
