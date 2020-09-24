import React, { useState } from 'react'
import Modal from 'react-modal'

import { Button } from '../button'
import { InputField } from '../input-field'

import styles from './ContactForm.module.css'

Modal.setAppElement('#root')

export type ContactFormState = {
  senderEmail: string
  subject: string
  message: string
}

export const ContactForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [values, setValues] = useState<ContactFormState>({
    senderEmail: '',
    subject: '',
    message: '',
  })

  const resetFormState = () => {
    setValues({
      senderEmail: '',
      subject: '',
      message: '',
    })
  }

  return (
    <>
      <Button
        size={'small'}
        label={'Contact SINTEF'}
        icon={'email'}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        style={{
          content: {
            margin: '0 20vw',
          },
        }}
      >
        <div className={styles.form}>
          <div className={styles.headRow}>
            <h2>Contact SINTEF</h2>
            <i
              className="material-icons"
              onClick={() => {
                setIsOpen(false)
                resetFormState()
              }}
            >
              close
            </i>
          </div>
          <div>
            <InputField
              variant={'standard'}
              label={'Subject'}
              placeholder={'The subject of your message'}
              onValueChanged={(subject) =>
                setValues({ ...values, subject: subject as string })
              }
            />
            <InputField
              variant={'standard'}
              type={'email'}
              label={'Your e-mail'}
              placeholder={'hans@hansen.no'}
              onValueChanged={(email) =>
                setValues({ ...values, senderEmail: email as string })
              }
            />
            <InputField
              variant={'standard'}
              type={'textarea'}
              label={'Message'}
              onValueChanged={(message) =>
                setValues({ ...values, message: message as string })
              }
            />
          </div>
          <div className={styles.submitButton}>
            <Button
              label={'Send'}
              onClick={() => {
                setIsOpen(false)
                // TODO: Send form data to BE and send e-mail there
              }}
              icon={'send'}
              iconSize={'32px'}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
