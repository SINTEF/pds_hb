import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ManageStaffmembersPage } from '.'

export default {
  title: 'pages/Manage staffmembers',
  component: ManageStaffmembersPage,
} as Meta

const Template: Story = (args) => <ManageStaffmembersPage {...args} />

export const Standard = Template.bind({})
