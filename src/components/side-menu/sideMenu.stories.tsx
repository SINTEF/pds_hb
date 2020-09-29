import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SideMenu, SideMenuProps } from '.'

export default {
  title: 'SideMenu',
  component: SideMenu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<SideMenuProps> = (args) => <SideMenu {...args} />

export const GeneralSideMenu = Template.bind({})
GeneralSideMenu.args = {
  menu: ['My account'],
}

export const OperatorSideMenu = Template.bind({})
OperatorSideMenu.args = {
  menu: [
    'My account',
    'Browse own equipment data',
    'Company account',
    'Manage staffmember',
    'Manage facilities',
  ],
}

export const AdminSideMenu = Template.bind({})
AdminSideMenu.args = {
  menu: [
    'My account',
    'Review next release',
    'Adapt premissions for user groups',
    'Add new companies',
    'Approve new users',
  ],
  alert: 2,
}
