import React from 'react'

import Ripples from 'react-ripples'

export interface IconButtonProps {
  icon: string
  onClick: () => void
  fontSize?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  fontSize = '24px',
}: IconButtonProps) => {
  return (
    <Ripples>
      <i
        className="material-icons"
        onClick={onClick}
        style={{ cursor: 'pointer', fontSize }}
        role="button"
        aria-label={icon}
      >
        {icon}
      </i>
    </Ripples>
  )
}
