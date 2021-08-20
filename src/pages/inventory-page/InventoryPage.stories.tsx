import React from 'react'
import { Story, Meta } from '@storybook/react'

import { InventoryPage } from '.'

export default {
  title: 'pages/InventoryPage',
  component: InventoryPage,
} as Meta

const Template: Story = (args) => <InventoryPage {...args} />

export const Standard = Template.bind({})
