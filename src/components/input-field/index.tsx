import React, { useState } from 'react'
import styles from './InputField.module.css'

export interface InputProps {
  value: string | number | Date | undefined
  onValueChanged: (value: string | number | FileList | Date | null) => void
  type?: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'file' | 'date'
  variant?: 'primary' | 'standard'
  label: string
  icon?: string
  placeholder?: string
  success?: boolean
  accept?: string
}

export const InputField: React.FC<InputProps> = ({
  type = 'text',
  variant = 'primary',
  value,
  onValueChanged,
  label,
  icon,
  placeholder,
  success,
  accept,
}: InputProps) => {
  const [hasContent, setHasContent] = useState<boolean>(!!value)
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
        success ? styles.success : '',
        type === 'textarea' ? styles.fieldPadding : '',
      ].join(' ')}
    >
      <div
        className={variant === 'primary' ? styles.primaryContent : styles.field}
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
            value={value as string | number}
            placeholder={placeholder}
            onChange={handleChanged}
            rows={10}
            cols={40}
          ></textarea>
        ) : null}
        {type === 'file' ? (
          <input
            id={label}
            type={type}
            placeholder={placeholder}
            onChange={handleChanged}
            accept={accept}
          ></input>
        ) : null}
        {type !== 'textarea' && type !== 'file' ? (
          <input
            id={label}
            type={type}
            value={value as string | number}
            placeholder={placeholder}
            onChange={handleChanged}
          ></input>
        ) : null}
        {icon ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : null}
      </div>
    </div>
  )
}
