import React from 'react'
import { Story, Meta } from '@storybook/react'

import { UpdateNotificationPage } from '.'

export default {
  title: 'pages/UpdateNotificationPage',
  component: UpdateNotificationPage,
} as Meta

const Template: Story = (args) => <UpdateNotificationPage {...args} />

export const Standard = Template.bind({})
