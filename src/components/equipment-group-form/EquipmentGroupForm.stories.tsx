import React from 'react'
import { Story, Meta } from '@storybook/react'
import { EquipmentGroupForm, EquipmentGroupFormProps } from '.'

export default {
  title: 'Equipment group form',
  component: EquipmentGroupForm,
} as Meta

const Template: Story<EquipmentGroupFormProps> = (args) => (
  <EquipmentGroupForm {...args} />
)

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  isOpen: true,
  onSave: (formValue) => formValue,
}

export const WithGroup = Template.bind({})
WithGroup.parameters = {
  storyshots: { disable: true },
}
WithGroup.args = {
  ...Standard.args,
  equipmentGroup: {
    name: 'Fire detectors',
    module: 'Input devices',
  },
}
