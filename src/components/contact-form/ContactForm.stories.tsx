import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ContactForm } from '.'

export default {
  title: 'ContactForm',
  component: ContactForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story = (args) => <ContactForm {...args} />

export const Standard = Template.bind({})
