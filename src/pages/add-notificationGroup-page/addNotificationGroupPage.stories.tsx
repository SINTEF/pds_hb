import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddNotificationGroupPage } from '.'

export default {
  title: 'pages/AddInventoryPage',
  component: AddNotificationGroupPage,
} as Meta

const Template: Story = (args) => <AddNotificationGroupPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
