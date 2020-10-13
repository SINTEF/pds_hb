import React, { useState, useEffect } from 'react'
import styles from './ChooseComponentPage.module.css'

import { Title } from '../../components/title'

import { Group } from '../../components/group'
import { IGroup } from '../../components/equipment-group-form'

export interface ChooseComponentPageProps {
  getComponents: () => IGroup[]
  getEquipmentGroups: () => IGroup[]
}

export const ChooseComponentPage: React.FC<ChooseComponentPageProps> = ({
  getEquipmentGroups,
  getComponents,
}: ChooseComponentPageProps) => {
  const [pageState, setPage] = useState<number>(1)
  const [groups, setGroups] = useState<IGroup[]>([])
  const [components, setComponents] = useState<IGroup[]>([])

  useEffect(() => {
    setGroups(getEquipmentGroups())
  }, [getEquipmentGroups])

  if (pageState === 1) {
    return (
      <div className={styles.container}>
        <Title title="Choose equipment group"> </Title>
        <div className={styles.components}>
          {groups.map((group, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <Group
                  isAdmin={false}
                  group={group}
                  onClick={() => {
                    setPage(2)
                    setComponents(getComponents)
                  }}
                ></Group>
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
          {components.map((group, index) => {
            return (
              <div key={index} className={styles.equipmentContainer}>
                <Group
                  isAdmin={false}
                  group={group}
                  onClick={() => setPage(2)}
                ></Group>
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
