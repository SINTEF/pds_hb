import React from 'react'
import { Story, Meta } from '@storybook/react'

import { NotFound } from '.'

export default {
  title: 'pages/Not found (404)',
  component: NotFound,
} as Meta

const Template: Story = (args) => <NotFound {...args} />

export const Standard = Template.bind({})
