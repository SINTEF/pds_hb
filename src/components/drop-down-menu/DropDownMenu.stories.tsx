import React from 'react'
import { Story, Meta } from '@storybook/react'

import { DropDownMenu, DropDownMenuProps } from '.'

export default {
  title: 'DropDownMenu',
  component: DropDownMenu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<DropDownMenuProps> = (args) => <DropDownMenu {...args} />

export const CompanyUser = Template.bind({})
CompanyUser.args = {
  isCompanyUser: true,
  username: 'Steve Jobs',
  company: 'Equinor AS',
}
