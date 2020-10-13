import React from 'react'

import styles from './Group.module.css'
import { EditEquipmentGroup } from '../edit-equipment-group'
import { IGroup } from '../equipment-group-form'

export interface GroupProps {
  group: IGroup

  icon?: string

  onClick: () => void

  isAdmin?: boolean
}

export const Group: React.FC<GroupProps> = ({
  group,
  onClick,
  isAdmin,
}: GroupProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} onClick={onClick}>
        <img
          className={styles.image}
          src={
            group.symbolUrl ||
            'https://www.svgrepo.com/show/131030/question-mark.svg'
          }
          alt={`Icon for group ${group.name}`}
        />
        {group.name}
      </div>
      <div className={styles.icon}>
        {isAdmin && <EditEquipmentGroup equipmentGroup={group} />}
      </div>
    </div>
  )
}
