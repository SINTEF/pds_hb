import React from 'react'
import { Story, Meta } from '@storybook/react'

import { MenuButton, MenuButtonProps } from '.'

export default {
  title: 'MenuButton',
  component: MenuButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<MenuButtonProps> = (args) => <MenuButton {...args} />

export const Standard = Template.bind({})
Standard.args = {
  label: 'Adapt premissions for user groups',
}

export const LogOut = Template.bind({})
LogOut.args = {
  label: 'Log out',
  type: 'logout',
}

export const Notify = Template.bind({})
Notify.args = {
  label: 'Approve new users',
  type: 'notify',
  alert: 1,
}
