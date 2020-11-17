import React from 'react'
import { Story, Meta } from '@storybook/react'

import { InputField, InputProps } from '.'

export default {
  title: 'Input field',
  component: InputField,
} as Meta

const Template: Story<InputProps> = (args) => <InputField {...args} />

export const PrimaryInput = Template.bind({})
PrimaryInput.args = {
  label: 'Input Label',
}

export const PrimaryTextArea = Template.bind({})
PrimaryTextArea.args = {
  label: 'Input Label',
  type: 'textarea',
}

export const PrimaryWithDefault = Template.bind({})
PrimaryWithDefault.args = {
  label: 'Input Label',
  value: 'Default value',
}

export const PrimaryWithIcon = Template.bind({})
PrimaryWithIcon.args = {
  label: 'Input label',
  value: 'Default value',
  icon: 'search',
}
export const PrimaryWithFile = Template.bind({})
PrimaryWithFile.args = {
  label: 'Input label',
  icon: 'add_photo_alternate',
  type: 'file',
}

export const StandardInput = Template.bind({})
StandardInput.args = {
  label: 'Input Label',
  variant: 'standard',
  placeholder: 'Input placeholder',
}
StandardInput.parameters = {
  backgrounds: { default: 'white' },
}

export const StandardTextArea = Template.bind({})
StandardTextArea.args = {
  label: 'Input Label',
  variant: 'standard',
  placeholder: 'Input placeholder',
  type: 'textarea',
}
StandardTextArea.parameters = {
  backgrounds: { default: 'white' },
}

export const StandardInputWithIcon = Template.bind({})
StandardInputWithIcon.args = {
  label: 'Input Label',
  variant: 'standard',
  placeholder: 'Input placeholder',
  icon: 'add_photo_alternate',
}
StandardInputWithIcon.parameters = {
  backgrounds: { default: 'white' },
}

export const StandardWithFile = Template.bind({})
StandardWithFile.args = {
  label: 'Input label',
  icon: 'add_photo_alternate',
  type: 'file',
  variant: 'standard',
}
StandardWithFile.parameters = {
  backgrounds: { default: 'white' },
}
