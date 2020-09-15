import React from 'react'

export type ContactFormProps = {
  name: string
  company: string
}

export const ContactForm: React.FC<ContactFormProps> = ({
  name,
  company,
}: ContactFormProps) => {
  return <p>ContactForm works!</p>
}
