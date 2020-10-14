import React from 'react'
import { Story, Meta } from '@storybook/react'

import { BrowseComponentPage } from '.'

export default {
  title: 'pages/Browse',
  component: BrowseComponentPage,
} as Meta

const Template: Story = (args) => <BrowseComponentPage {...args} />

export const Standard = Template.bind({})
