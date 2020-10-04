import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RegisteredDataField, RegisteredDataFieldProps } from '.'

export default {
  title: 'RegisteredDataField',
  component: RegisteredDataField,
  argTypes: {},
} as Meta

const Template: Story<RegisteredDataFieldProps> = (args) => (
  <RegisteredDataField {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  component: 'Flame Detector',
  period: '2017-2020',
  t: 123456,
  tags: 754,
  du: 5,
  edited: '24.12.2017',
}
