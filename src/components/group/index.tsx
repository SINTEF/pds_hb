import React from 'react'

import styles from './Group.module.css'
export interface GroupProps {
  group: string

  icon?: string

  onClick: () => void
}

export const Group: React.FC<GroupProps> = ({ group, onClick }: GroupProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} onClick={onClick}>
        <img
          className={styles.image}
          src={'https://www.svgrepo.com/show/131030/question-mark.svg'}
          alt={`Icon for group ${group}`}
        />
        {group}
      </div>
    </div>
  )
}
