import React from 'react'
import { Story, Meta } from '@storybook/react'

import { CompanyUserPage } from '.'

export default {
  title: 'pages/companyuser',
  Component: CompanyUserPage,
} as Meta

const Template: Story = (args) => <CompanyUserPage {...args} />

export const Start = Template.bind({})
