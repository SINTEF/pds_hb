import React from 'react'
import { Story, Meta } from '@storybook/react'

import { GroupProps, Group } from '.'

export default {
  title: 'Group',
  component: Group,
} as Meta

const Template: Story<GroupProps> = (args) => <Group {...args} />

export const Standard = Template.bind({})
Standard.args = {
  isAdmin: false,
  group: {
    id: 'fsfsa',
    name: 'Fire equipment',
    symbolUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aiga_fire_extinguisher.svg/337px-Aiga_fire_extinguisher.svg.png',
  },
}

export const Editable = Template.bind({})
Editable.args = {
  isAdmin: true,
  group: {
    id: 'fsfsa',
    name: 'Fire equipment',
    symbolUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aiga_fire_extinguisher.svg/337px-Aiga_fire_extinguisher.svg.png',
  },
}

export const NoImg = Template.bind({})
NoImg.args = {
  isAdmin: false,
  group: {
    id: 'fsfsa',
    name: 'Fire equipment',
  },
}