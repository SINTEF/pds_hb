import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SideMenu, SideMenuProps } from '.'
import { MenuButton } from '../menu-button'

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
  children: <MenuButton label="My account" />,
}

export const OperatorSideMenu = Template.bind({})
OperatorSideMenu.args = {
  children: [
    'My account',
    'Browse own equipment data',
    'Company account',
    'Manage staffmember',
    'Manage facilities',
  ].map((title) => <MenuButton label={title} key={title} />),
}

export const AdminSideMenu = Template.bind({})
AdminSideMenu.args = {
  children: [
    ...[
      'My account',
      'Review next release',
      'Adapt premissions for user groups',
      'Add new companies',
    ].map((title) => <MenuButton label={title} key={title} />),
    <MenuButton
      label="Approve new users"
      alert={2}
      key={'Approve new users'}
    />,
  ],
}
