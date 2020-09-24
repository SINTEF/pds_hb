import React from 'react'
import styles from './Filter.module.css'
import { FilterButton } from '../filter-button'
import { MenuButton } from '../menu-button'
import { useState } from 'react'

export interface FilterProps {
  category: string

  filters: Array<string>
}

export const Filter: React.FC<FilterProps> = ({
  category,
  filters,
}: FilterProps) => {
  const [isClicked, setMode] = useState<boolean>(false)
  const [chosen, setChosen] = useState<string>(category)

  return (
    <div className={styles.open}>
      <div className={styles.closed}>
        <FilterButton
          label={chosen}
          onClick={() => setMode(!isClicked)}
          open={isClicked}
        ></FilterButton>
      </div>
      {isClicked && (
        <ul className={styles.list}>
          {filters.map((s) => {
            let listItem = 'standard'
            if (s === chosen) {
              listItem = 'clicked'
            }
            return (
              <li className={styles.listItem} key={s}>
                <MenuButton
                  onClick={() => {
                    setMode(!isClicked)
                    setChosen(s)
                  }}
                  label={s}
                  type={listItem}
                ></MenuButton>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
