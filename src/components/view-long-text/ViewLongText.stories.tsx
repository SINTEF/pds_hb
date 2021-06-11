import React from 'react'
import { Story, Meta } from '@storybook/react'
import { ViewLongTextProps, ViewLongText } from '.'

export default {
  title: 'View long text',
  component: ViewLongText,
} as Meta

const Template: Story<ViewLongTextProps> = (args) => <ViewLongText {...args} />

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  isOpen: true,
  text: 'hola',
}
