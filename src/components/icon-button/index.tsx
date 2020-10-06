import React from 'react'

import Ripples from 'react-ripples'

export interface IconButtonProps {
  icon: string
  onClick: () => void
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
}: IconButtonProps) => {
  return (
    <Ripples>
      <i className="material-icons" onClick={onClick}>
        {icon}
      </i>
    </Ripples>
  )
}
