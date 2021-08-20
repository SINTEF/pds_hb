import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddInventoryPage } from '.'

export default {
  title: 'pages/AddInventoryPage',
  component: AddInventoryPage,
} as Meta

const Template: Story = (args) => <AddInventoryPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
