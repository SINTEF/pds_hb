import React from 'react'
import { Story, Meta } from '@storybook/react'

import { TextBox, TextBoxProps } from '.'

export default {
  title: 'TextBox',
  component: TextBox,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<TextBoxProps> = (args) => <TextBox {...args} />

export const Large = Template.bind({})
Large.args = {
  title: 'Description',
  content:
    'The detector includes the sensor and local electronics such as the address-/ interface unit.',
  size: 'large',
}

export const Small = Template.bind({})
Small.args = {
  title: 'Description',
  content:
    'The detector includes the sensor and local electronics such as the address-/ interface unit.',
  size: 'small',
}

export const SmallAdminTextBox = Template.bind({})
SmallAdminTextBox.args = {
  title: 'Description',
  content: 'test',
  size: 'small',
  isAdmin: true,
}

export const LargeAdminTextBox = Template.bind({})
LargeAdminTextBox.args = {
  title: 'Description',
  content: 'test',
  size: 'large',
  isAdmin: true,
}
