import React, { useState } from 'react'
import { formatCamelCase } from '../../utils/casing'
import styles from './SearchField.module.css'

export interface SearchFieldProps {
  onValueChanged: (value: string) => void

  value?: string

  label?: string

  //defaultValue?: string

  placeholder?: string

  suggestions: Array<string>

  icon?: string

  variant: 'primary' | 'secondary' | 'small'

  onClick: (selectedComponent: string) => void

  allowAllInputs?: boolean
}

export const SearchField: React.FC<SearchFieldProps> = ({
  variant = 'primary',
  //defaultVlue,
  label,
  placeholder,
  suggestions,
  icon,
  allowAllInputs,
  onClick,
  value,
  onValueChanged,
}: SearchFieldProps) => {
  const [filtered, setFiltered] = useState<Array<string>>([])
  const [chosen, setChosen] = useState<number>(0)
  const [selected, setSelected] = useState<string>('') //DefaultValue
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && chosen !== filtered.length - 1) {
      setChosen(chosen + 1)
    } else if (event.key === 'ArrowUp' && chosen > 0) {
      setChosen(chosen - 1)
    } else if (event.key === 'Enter' && filtered.length > 0) {
      onClick(filtered[chosen])
      setSelected(filtered[chosen])
      setFiltered([])
    } else if (event.key === 'Enter' && allowAllInputs) {
      onClick(event.currentTarget.value)
      setSelected(event.currentTarget.value)
    }
  }
  const handleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget.value
    setSelected(input)
    onValueChanged(input)
    if (input !== '') {
      setFiltered(
        suggestions.filter(
          (suggestion) =>
            suggestion.toLowerCase().indexOf(input.toLowerCase()) !== -1
        )
      )
    } else {
      setFiltered([])
      if (variant === 'secondary') {
        setFiltered(suggestions)
      }
      setChosen(0)
    }
  }
  const elementClicked = (event: React.MouseEvent) => {
    event.preventDefault()
  }
  return (
    <div
      className={[styles[variant], styles.SearchField].join(' ')}
      onBlur={() => setFiltered([])}
    >
      <div className={styles.field}>
        {variant === 'secondary' ? <label>{label}:</label> : null}
        <input
          placeholder={placeholder}
          onChange={handleChanged}
          onKeyDown={handleKeyPress}
          onFocus={handleChanged}
          //defaultValue={defaultValue}
          value={value ?? selected}
          type="text"
        ></input>
        {variant === 'primary' ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : null}
      </div>
      <ul>
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
              onMouseDown={elementClicked}
              onClick={() => {
                onClick(filtered[chosen])
                setSelected(filtered[chosen])
                setFiltered([])
              }}
            >
              {formatCamelCase(suggestion)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
