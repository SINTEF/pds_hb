import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ContactForm, ContactFormProps } from '.'

export default {
  title: 'ContactForm',
  component: ContactForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ContactFormProps> = (args) => <ContactForm {...args} />

export const Standard = Template.bind({})
Standard.args = {
  name: 'Ada Lovelace',
  company: 'SINTEF',
}
