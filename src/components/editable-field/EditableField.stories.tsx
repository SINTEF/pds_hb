import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { EditableField, EditableFieldProps } from '.'

export default {
  title: 'Components/editable-field',
  component: EditableField,
} as Meta

const Template: Story<EditableFieldProps> = (args) => (
  <EditableField {...args} />
)

export const Viewmode = Template.bind({})
Viewmode.args = {
  content: '123456',
  index: 'Index',
  mode: 'view',
  isAdmin: true,
}

export const Editmode = Template.bind({})
Editmode.args = {
  content: '123456',
  index: 'Index',
  mode: 'edit',
  isAdmin: true,
}

export const NotAdmin = Template.bind({})
NotAdmin.args = {
  content: '123456',
  index: 'Index',
  mode: 'edit',
  isAdmin: false,
}
