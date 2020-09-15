import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Button, ButtonProps } from '.'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ButtonProps> = (args) => <Button {...args} />

export const Standard = Template.bind({})
Standard.args = {
  label: 'Click me!',
}

export const Primary = Template.bind({})
Primary.args = {
  label: 'Click me!',
  type: 'primary',
}

export const Danger = Template.bind({})
Danger.args = {
  type: 'danger',
  label: 'Click me!',
  icon: 'delete',
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'Button',
}
