import React from 'react'

import styles from './EquipmentGroup.module.css'

export interface EquipmentGroupProps {
  name: string

  symbol: string

  icon?: string

  onClick: () => void

  forEdit: () => void

  isAdmin?: boolean
}

export const EquipmentGroup: React.FC<EquipmentGroupProps> = ({
  name,
  symbol = 'https://www.svgrepo.com/show/131030/question-mark.svg',
  onClick,
  forEdit,
  isAdmin,
  icon = 'editor',
}: EquipmentGroupProps) => {
  return (
    <div>
      <div className={styles.container} onClick={onClick}>
        <img className={styles.image} src={symbol} />
        {name}
        {isAdmin && (
          <i
            className={['material-icons', styles.icon].join(' ')}
            onClick={forEdit}
          >
            {icon}
          </i>
        )}
      </div>
    </div>
  )
}
