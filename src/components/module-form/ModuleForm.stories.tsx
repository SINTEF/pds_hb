import React from 'react'
import { Story, Meta } from '@storybook/react'
import { ModuleForm, ModuleFormProps } from '.'

export default {
  title: 'Module form',
  component: ModuleForm,
} as Meta

const Template: Story<ModuleFormProps> = (args) => <ModuleForm {...args} />

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  isOpen: true,
  onSave: (formValue) => formValue,
}

export const WithModule = Template.bind({})
WithModule.parameters = {
  storyshots: { disable: true },
}
WithModule.args = {
  ...Standard.args,
  equipmentModule: {
    name: 'Test module',
    equipmentGroups: [],
  },
}
