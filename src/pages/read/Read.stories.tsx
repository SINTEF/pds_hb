import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Read } from '.'

export default {
  title: 'Pages/Read',
  component: Read,
} as Meta

const Template: Story = (args) => <Read {...args} />

export const Standard = Template.bind({})
