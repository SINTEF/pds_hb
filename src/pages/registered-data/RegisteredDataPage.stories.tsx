import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RegisteredDataPage } from '.'

export default {
  title: 'RegisteredData',
  Component: RegisteredDataPage,
} as Meta

const Template: Story = (args) => <RegisteredDataPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
