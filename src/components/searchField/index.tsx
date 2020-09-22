import React from 'react'
import styles from './SearchField.module.css'
import { useState } from 'react'

export interface SearchFieldProps {
  onValueChanged: (value: string) => void

  defaultValue: string

  label: string

  placeholder?: string

  suggestions: Array<string>

  icon: string

  variant: 'primary' | 'secondary'

  input: string
}

export const SearchField: React.FC<SearchFieldProps> = ({
  variant = 'primary',
  label,
  placeholder,
  suggestions,
  icon,
  input,
  ...props
}: SearchFieldProps) => {
  const [filtered, setFiltered] = useState<Array<string>>([])
  const [chosen, setChosen] = useState<number>(0)
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' && chosen !== filtered.length - 1) {
      setChosen(chosen + 1)
    } else if (event.key === 'ArrowUp' && chosen > 0) {
      setChosen(chosen - 1)
    } else if (event.key === 'Enter' && filtered.length > 0) {
      alert(filtered[chosen])
    }
  }
  const handleHanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    input = event.currentTarget.value
    if (input !== '') {
      setFiltered(
        suggestions.filter(
          (s) => s.toLowerCase().indexOf(input.toLowerCase()) !== -1
        )
      )
    } else {
      setFiltered([])
      setChosen(0)
    }
  }

  return (
    <div className={styles.SearchField}>
      <div className={[styles[variant], styles.field].join(' ')}>
        {variant === 'secondary' ? <label>Component:</label> : null}
        <input
          id={label}
          placeholder={placeholder}
          onChange={handleHanged}
          onKeyDown={handleKeyPress}
        ></input>
        {variant === 'primary' ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : null}
      </div>
      <ul className={styles.filtered}>
        {filtered.map((s, i) => {
          let style = 'notCurrent'
          if (i === chosen) {
            style = 'current'
          }
          return (
            <li
              className={styles[style]}
              key={s}
              onClick={() => alert(filtered[chosen])}
              onMouseEnter={() => setChosen(i)}
            >
              {s}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
