import React from 'react'
import styles from './Title.module.css'

export interface TitleProps {
  title: string

  dynamic?: string
}

export const Title: React.FC<TitleProps> = ({ title, dynamic }: TitleProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.titlecontainer}>
        <div
          className={[styles.title, dynamic ? null : styles.notdynamic].join(
            ' '
          )}
        >
          {title}
        </div>
        {dynamic && <div className={styles.dynamic}>{dynamic}</div>}
      </div>
      <hr className={styles.line} />
    </div>
  )
}
