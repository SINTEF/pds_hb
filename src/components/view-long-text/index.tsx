import React from 'react'

import Modal from 'react-modal'

import { Title } from '../title'

import styles from './ViewLongText.module.css'

Modal.setAppElement(document.getElementById('root') as HTMLElement)

export interface ViewLongTextProps {
  isOpen: boolean
  text: string
  title: string
}

export const ViewLongText: React.FC<ViewLongTextProps> = ({
  isOpen,
  text,
  title,
}: ViewLongTextProps) => {
  return (
    <Modal
      isOpen={isOpen}
      className={styles.content}
      shouldCloseOnOverlayClick={true}
    >
      <Title title={title} />
      <div className={styles.text}>{text}</div>
      <div className={styles.description}>Click anywhere to close</div>
    </Modal>
  )
}
