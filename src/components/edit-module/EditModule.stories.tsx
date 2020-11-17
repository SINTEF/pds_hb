import React from 'react'
import { Story, Meta } from '@storybook/react'
import { EditModule, EditModuleProps } from '.'

export default {
  title: 'Edit module',
  component: EditModule,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<EditModuleProps> = (args) => <EditModule {...args} />

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  equipmentModule: {
    name: 'nameNespm',
    equipmentGroups: [],
  },
}
