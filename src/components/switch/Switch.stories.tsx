import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Switch, SwitchProps } from '.'

export default {
  title: 'Switch',
  component: Switch,
  argTypes: {},
} as Meta

const Template: Story<SwitchProps> = (args) => <Switch {...args} />

export const Standard = Template.bind({})
Standard.args = {}

export const Checked = Template.bind({})
Checked.args = {
  checked: true,
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
}
