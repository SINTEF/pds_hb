import React from 'react'
import { Story, Meta } from '@storybook/react'

import { UpdateInventoryPage } from '.'

export default {
  title: 'pages/UpdateInventoryPage',
  component: UpdateInventoryPage,
} as Meta

const Template: Story = (args) => <UpdateInventoryPage {...args} />

export const Standard = Template.bind({})
