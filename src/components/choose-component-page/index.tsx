import React, { useState } from 'react'
import styles from './ChooseComponentPage.module.css'

import { Title } from '../title'
import { EquipmentGroup } from '../equipment-group'

export interface ChooseComponentPageProps {
  getComponents: () => Array<string>
  getEquipmentGroups: () => Array<string>
  getModules: () => Array<string>
}

export const ChooseComponentPage: React.FC<ChooseComponentPageProps> = ({
  getModules,
  getEquipmentGroups,
  getComponents,
}: ChooseComponentPageProps) => {
  const [pageState, setPage] = useState<number>(1)
  const [button, setbutton] = useState<Array<string>>(getEquipmentGroups)
  const [category, setCategory] = useState<Array<string>>(getEquipmentGroups)
  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>
        <div className={styles.components}>
          {button.map((group, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <EquipmentGroup
                  isAdmin={false}
                  name={group}
                  symbol={
                    'https://www.svgrepo.com/show/131030/question-mark.svg'
                  }
                  onClick={() => {
                    setPage(2)
                    setbutton(getComponents)
                  }}
                ></EquipmentGroup>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  if (pageState === 2) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>
        <div className={styles.components}>
          {button.map((group, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <EquipmentGroup
                  isAdmin={false}
                  name={group}
                  symbol={
                    'https://www.svgrepo.com/show/131030/question-mark.svg'
                  }
                  onClick={() => setPage(2)}
                ></EquipmentGroup>
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    return <div>{'Unknown!'}</div>
  }
}
