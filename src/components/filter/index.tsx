import React, { useState } from 'react'
import styles from './Filter.module.css'
import { FilterButton } from '../filter-button'
import { MenuButton } from '../menu-button'

export interface FilterProps {
  category: string

  filters: Array<string>

  onClick: (SelectedMenuItem: string) => void
}

export const Filter: React.FC<FilterProps> = ({
  category,
  filters,
  onClick,
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
          {filters.map((filter, index) => {
            let listItem = 'standard'
            if (filters[index] === chosen) {
              listItem = 'clicked'
            }
            return (
              <li className={styles.listItem} key={filter}>
                <MenuButton
                  onClick={() => {
                    setMode(!isClicked)
                    setChosen(filter)
                    onClick(filter)
                  }}
                  label={filter}
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
