import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ApproveUsersPage } from '.'

export default {
  title: 'pages/ApproveUsersPage',
  component: ApproveUsersPage,
} as Meta

const Template: Story = (args) => <ApproveUsersPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
