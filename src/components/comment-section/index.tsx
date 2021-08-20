import React from 'react'

import Modal from 'react-modal'
import styles from './commentSection.module.css'

Modal.setAppElement(document.getElementById('root') as HTMLElement)

export interface CommentSectionProps {
  isOpen: boolean
  children: JSX.Element[]
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  isOpen,
  children,
}: CommentSectionProps) => {
  return (
    <Modal
      isOpen={isOpen}
      className={styles.content}
      shouldCloseOnOverlayClick={true}
    >
      <div className={styles.children}>{children}</div>
    </Modal>
  )
}
