import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ManageFacilitiesPage } from '.'

export default {
  title: 'pages/Mange facilities',
  component: ManageFacilitiesPage,
} as Meta

const Template: Story = (args) => <ManageFacilitiesPage {...args} />

export const Standard = Template.bind({})
