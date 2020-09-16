import React, { useState } from 'react'
import styles from './InputField.module.css'

export interface InputProps {
  defaultValue: string
  onValueChanged: (value: string | FileList | null) => void
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'file'
  variant: 'primary' | 'standard'
  label: string
  icon?: string
  placeholder?: string
  success?: boolean
}

export const InputField: React.FC<InputProps> = ({
  type = 'text',
  variant = 'primary',
  defaultValue,
  onValueChanged,
  label,
  icon,
  placeholder,
  success,
}: InputProps) => {
  const [hasContent, setHasContent] = useState<boolean>(!!defaultValue)
  const handleChanged = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value !== '' && !hasContent) {
      setHasContent(true)
    } else if (event.target.value === '' && hasContent) {
      setHasContent(false)
    }
    if (type === 'file') {
      onValueChanged((event.target as EventTarget & HTMLInputElement).files)
    } else {
      onValueChanged(event.target.value)
    }
  }

  return (
    <div
      className={[
        styles[variant],
        styles.field,
        success ? styles.success : '',
        type === 'textarea' ? styles.fieldPadding : '',
      ].join(' ')}
    >
      <label
        className={
          variant === 'primary' && (hasContent || type === 'file')
            ? styles.labelTuck
            : ''
        }
        style={{ alignSelf: type === 'textarea' ? 'flex-start' : '' }}
        htmlFor={label}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={label}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChanged}
          rows={5}
          cols={40}
        ></textarea>
      ) : (
        <input
          id={label}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChanged}
        ></input>
      )}
      {icon ? <i className={'material-icons ' + styles.icon}>{icon}</i> : null}
    </div>
  )
}