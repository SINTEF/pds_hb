import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AnalysisPage } from '.'

export default {
  title: 'pages/AnalysisPage',
  component: AnalysisPage,
} as Meta

const Template: Story = (args) => <AnalysisPage {...args} />

export const Standard = Template.bind({})
