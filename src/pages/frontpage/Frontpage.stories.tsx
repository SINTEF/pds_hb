import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Frontpage } from '.'

export default {
  title: 'pages/Frontpage',
  component: Frontpage,
} as Meta

const Template: Story = (args) => <Frontpage {...args} />

export const generalFrontpage = Template.bind({})
generalFrontpage.args = {}
