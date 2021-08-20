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
  group: 'Fire equipment',
}

export const NoImg = Template.bind({})
NoImg.args = {
  group: 'Fire equipment',
}
