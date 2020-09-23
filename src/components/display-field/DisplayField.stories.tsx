import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { DisplayField, DisplayFieldProps } from '.'

export default {
  title: 'Components/display-field',
  component: DisplayField,
} as Meta

const Template: Story<DisplayFieldProps> = (args) => <DisplayField {...args} />

export const Standard = Template.bind({})
Standard.args = {
  content: '123456',
  index: 'Index',
}
