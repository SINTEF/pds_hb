import React from 'react'
import { Story, Meta } from '@storybook/react'
import { EditEquipmentGroup, EditEquipmentGroupProps } from '.'

export default {
  title: 'Edit Equipment group',
  component: EditEquipmentGroup,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<EditEquipmentGroupProps> = (args) => (
  <EditEquipmentGroup {...args} />
)

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  equipmentGroup: {
    name: 'nameNespm',
    module: 'Input devices',
  },
}
