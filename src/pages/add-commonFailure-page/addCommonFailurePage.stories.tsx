import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddCommonFailurePage } from '.'

export default {
  title: 'pages/AddCommonFailurePage',
  component: AddCommonFailurePage,
} as Meta

const Template: Story = (args) => <AddCommonFailurePage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
