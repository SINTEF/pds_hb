import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ManageStaffmembersPage, ManageStaffmembersPageProps } from '.'

export default {
  title: 'pages/Manage staffmembers',
} as Meta

const users = [
  {
    name: 'Mona Lisa',
    mail: 'mona.lisa@gmail.com',
    joined: '25.08.2020',
  },
  {
    name: 'Da Vinci',
    mail: 'da.vinci@gmail.com',
    joined: '12.06.2020',
  },
]

const Template: Story<ManageStaffmembersPageProps> = (args) => (
  <ManageStaffmembersPage {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  getStaff: () => users,
  getTotalStaffNumber: () => 4,
  removeUser: (user: { name: string; mail: string; joined: string }) =>
    users.filter((item) => ![user].includes(item)),
}
