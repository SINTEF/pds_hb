import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RegisteredData } from '.'

export default {
  title: 'RegisteredData',
  Component: RegisteredData,
} as Meta

const Template: Story = (args) => <RegisteredData {...args} />

export const Standard = Template.bind({})
Standard.args = {}
