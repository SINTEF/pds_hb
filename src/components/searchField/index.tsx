import React, { useState } from 'react'
import styles from './SearchField.module.css'

export interface SearchFieldProps {
  onValueChanged: (value: string) => void

  defaultValue: string

  label?: string

  placeholder?: string

  suggestions: Array<string>

  icon: string

  variant: 'primary' | 'secondary'

  onClick: (selectedComponent: string) => void
}

export const SearchField: React.FC<SearchFieldProps> = ({
  variant = 'primary',
  label,
  placeholder,
  suggestions,
  icon,
  onClick,
  onValueChanged,
}: SearchFieldProps) => {
  const [filtered, setFiltered] = useState<Array<string>>([])
  const [chosen, setChosen] = useState<number>(0)
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' && chosen !== filtered.length - 1) {
      setChosen(chosen + 1)
    } else if (event.key === 'ArrowUp' && chosen > 0) {
      setChosen(chosen - 1)
    } else if (event.key === 'Enter' && filtered.length > 0) {
      onClick(filtered[chosen])
    }
  }
  const handleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget.value
    onValueChanged(event.currentTarget.value)
    if (input !== '') {
      setFiltered(
        suggestions.filter(
          (suggestion) =>
            suggestion.toLowerCase().indexOf(input.toLowerCase()) !== -1
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
        {variant === 'secondary' ? <label>{label}:</label> : null}
        <input
          placeholder={placeholder}
          onChange={handleChanged}
          onKeyDown={handleKeyPress}
        ></input>
        {variant === 'primary' ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : null}
      </div>
      <ul className={styles.filtered}>
        {filtered.map((suggestion, index) => {
          let style = 'notCurrent'
          if (index === chosen) {
            style = 'current'
          }
          return (
            <li
              className={styles[style]}
              key={suggestion}
              onMouseEnter={() => setChosen(index)}
              onClick={() => onClick(filtered[chosen])}
            >
              {suggestion}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
