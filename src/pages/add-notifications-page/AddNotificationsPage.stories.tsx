import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddNotificationsPage } from '.'

export default {
  title: 'pages/AddNotificationsPage',
  component: AddNotificationsPage,
} as Meta

const Template: Story = (args) => <AddNotificationsPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
