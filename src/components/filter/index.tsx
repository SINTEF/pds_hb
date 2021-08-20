import React, { useState } from 'react'
import styles from './Filter.module.css'
import { FilterButton } from '../filter-button'

export interface FilterProps {
  category: string

  filters: Record<string, boolean>

  onClick: (SelectedMenuItem: string, newValue: boolean) => void
}

export const Filter: React.FC<FilterProps> = ({
  category,
  filters,
  onClick,
}: FilterProps) => {
  const [isClicked, setMode] = useState<boolean>(false)
  return (
    <div className={styles.open}>
      <FilterButton
        label={category}
        onClick={() => setMode(!isClicked)}
        open={isClicked}
        width={window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--max-width')}
      ></FilterButton>

      {isClicked && (
        <ul className={styles.list}>
          {Object.entries(filters).map(([filter, value]) => {
            return (
              <li
                className={styles.listItem}
                key={filter}
                onClick={() => onClick(filter, !value)}
              >
                <hr />
                <div className={styles.listItemContent}>
                  <input type="checkbox" checked={value}></input>
                  {filter}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
