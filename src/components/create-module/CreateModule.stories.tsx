import React from 'react'
import { Story, Meta } from '@storybook/react'
import { CreateModule } from '.'

export default {
  title: 'Create Module',
  component: CreateModule,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story = (args) => <CreateModule {...args} />

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
