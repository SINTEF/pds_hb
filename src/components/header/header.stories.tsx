import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Header, HeaderProps } from '.'

export default {
  title: 'Header',
  component: Header,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<HeaderProps> = (args) => <Header {...args} />

export const Standard = Template.bind({})
Standard.args = {
  isCompanyUser: true,
  username: 'Johnny Bravvo',
  company: 'Cartoon Network',
}
