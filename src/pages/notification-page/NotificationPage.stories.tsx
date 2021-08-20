import React from 'react'
import { Story, Meta } from '@storybook/react'

import { NotificationPage } from '.'

export default {
  title: 'pages/NotificationPage',
  component: NotificationPage,
} as Meta

const Template: Story = (args) => <NotificationPage {...args} />

export const Standard = Template.bind({})
