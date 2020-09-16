import React from 'react'
import Ripples from 'react-ripples'

import styles from './Button.module.css'

export interface ButtonProps {
  type?: 'standard' | 'danger' | 'primary'

  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label?: string
  /**
   * Button icon
   * Use a material icon font glyph
   */
  icon?: string
  /**
   * Optional click handler
   */
  onClick: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  type = 'standard',
  size = 'medium',
  icon = 'chevron_right',
  backgroundColor,
  label,
  onClick,
}: ButtonProps) => {
  return (
    <Ripples>
      <button
        type="button"
        className={[styles.button, styles[size], styles[type]].join(' ')}
        style={{ backgroundColor }}
        onClick={onClick}
      >
        {label}
        {icon ? (
          <i className={'material-icons ' + styles.icon}>{icon}</i>
        ) : null}
      </button>
    </Ripples>
  )
}
