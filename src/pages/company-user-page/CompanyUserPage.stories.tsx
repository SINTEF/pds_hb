import React from 'react'
import { Story, Meta } from '@storybook/react'

import { CompanyUserPage, CompanyUserPageProps } from '.'

export default {
  title: 'pages/companyuser',
  Page: CompanyUserPage,
} as Meta

const Template: Story<CompanyUserPageProps> = (args) => (
  <CompanyUserPage {...args} />
)

const company: {
  companyName: string
  email: string
  phone: string
  description: string
  photo: string
} = {
  companyName: 'Equinor AS',
  email: 'post@Equinor.com',
  phone: '22225555',
  description: 'This is a description of the company Equinor AS.',
  photo: 'none',
}

export const Equinor = Template.bind({})
Equinor.args = {
  getCompany: () => company,
}
