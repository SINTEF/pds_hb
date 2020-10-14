import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddDataPage, AddDataPageProps } from '.'

export default {
  title: 'pages/AddDataPagePage',
  component: AddDataPage,
} as Meta

const Template: Story<AddDataPageProps> = (args) => <AddDataPage {...args} />

export const Standard = Template.bind({})
Standard.args = {}
