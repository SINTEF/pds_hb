import React from 'react'
import { Story, Meta } from '@storybook/react'
import { CreateEquipmentGroup } from '.'

export default {
  title: 'Create Equipment group',
  component: CreateEquipmentGroup,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story = (args) => <CreateEquipmentGroup {...args} />

export const Standard = Template.bind({})
