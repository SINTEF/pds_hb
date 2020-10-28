import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddComponentPage } from '.'

export default {
  title: 'pages/AddComponentPage',
  component: AddComponentPage,
} as Meta

const Template: Story = (args) => <AddComponentPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
