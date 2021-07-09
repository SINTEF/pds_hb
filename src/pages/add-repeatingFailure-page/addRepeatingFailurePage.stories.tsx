import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddRepeatingFailurePage } from '.'

export default {
  title: 'pages/AddCommonFailurePage',
  component: AddRepeatingFailurePage,
} as Meta

const Template: Story = (args) => <AddRepeatingFailurePage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
