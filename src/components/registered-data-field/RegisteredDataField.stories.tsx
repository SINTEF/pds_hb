import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RegisteredDataField, RegisteredDataFieldProps } from '.'

export default {
  title: 'RegisteredDataField',
  component: RegisteredDataField,
  argTypes: {},
} as Meta

const Template: Story<RegisteredDataFieldProps> = (args) => (
  <RegisteredDataField {...args}>
    <label> test1 </label>
    <label type="submit">test2</label>
    <label> test2 </label>
    <i className={['material-icons'].join(' ')}>{'editor'}</i>
  </RegisteredDataField>
)

export const Standard = Template.bind({})
