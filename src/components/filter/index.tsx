import React, { useState } from 'react'
import styles from './Filter.module.css'
import { FilterButton } from '../filter-button'
import { MenuButton } from '../menu-button'

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
      <FilterButton
        label={chosen}
        onClick={() => setMode(!isClicked)}
        open={isClicked}
      ></FilterButton>

      {isClicked && (
        <ul className={styles.list}>
          {filters.map((s, i) => {
            let listItem = 'standard'
            if (filters[i] === chosen) {
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
