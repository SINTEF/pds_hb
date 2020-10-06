import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Title, TitleProps } from '.'

export default {
  title: 'Title',
  component: Title,
} as Meta

const Template: Story<TitleProps> = (args) => <Title {...args} />

export const Standard = Template.bind({})
Standard.args = {
  title: 'Choose Facility',
}

export const Dynamic: Story<TitleProps> = (args) => <Title {...args} />
Dynamic.args = {
  title: 'Failure data at',
  dynamic: 'Askeladden',
}
