import React from 'react'
import { Story, Meta } from '@storybook/react'
import { EquipmentGroupForm, EquipmentGroupFormProps } from '.'

export default {
  title: 'Equipment group form',
  component: EquipmentGroupForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<EquipmentGroupFormProps> = (args) => (
  <EquipmentGroupForm {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  isOpen: true,
  onSave: (formValue) => console.log(formValue),
}
export const WithGroup = Template.bind({})
WithGroup.args = {
  isOpen: true,
  onSave: (formValue) => console.log(formValue),
  equipmentGroup: {
    id: 'dfrewre',
    name: 'Fire detectors',
  },
}
