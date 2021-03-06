import React from 'react'
import { Story, Meta } from '@storybook/react'

import { OwnDataPage } from '.'

export default {
  title: 'pages/OwnDataPage',
  component: OwnDataPage,
} as Meta

const Template: Story = (args) => <OwnDataPage {...args} />

export const Standard = Template.bind({})
