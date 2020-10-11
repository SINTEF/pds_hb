import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Login } from '.'

export default {
  title: 'Pages/Login',
  component: Login,
} as Meta

const Template: Story = (args) => <Login {...args} />

export const Start = Template.bind({})
