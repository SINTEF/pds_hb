import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Read, ReadProps } from '.'

export default {
  title: 'Pages/Read',
  component: Read,
} as Meta

const Template: Story<ReadProps> = (args) => <Read {...args} />

export const Standard = Template.bind({})

export const Admin = Template.bind({})
Admin.args = {
  isAdmin: true,
}
