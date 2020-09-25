import React from 'react'
import { Story, Meta } from '@storybook/react'

import { EquipmentGroup, EquipmentGroupProps } from '.'

export default {
  title: 'EquipmentGroup',
  component: EquipmentGroup,
} as Meta

const Template: Story<EquipmentGroupProps> = (args) => (
  <EquipmentGroup {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  isAdmin: false,
  name: 'Fire equipment',
  symbol:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aiga_fire_extinguisher.svg/337px-Aiga_fire_extinguisher.svg.png',
}

export const Editable = Template.bind({})
Editable.args = {
  isAdmin: true,
  name: 'Fire equipment',
  symbol:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aiga_fire_extinguisher.svg/337px-Aiga_fire_extinguisher.svg.png',
}
