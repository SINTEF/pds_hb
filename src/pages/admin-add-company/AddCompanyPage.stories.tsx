import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddCompanyPage } from '.'

export default {
  title: 'pages/AddCompanyPage',
  component: AddCompanyPage,
} as Meta

const Template: Story = (args) => <AddCompanyPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
