import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Frontpage, FrontpageProps } from '.'

export default {
  title: 'Frontpage',
  component: Frontpage,
} as Meta

const Template: Story<FrontpageProps> = (args) => <Frontpage {...args} />

export const generalFrontpage = Template.bind({})
generalFrontpage.args = {
  userType: 'general',
}

export const operatorFrontpage = Template.bind({})
operatorFrontpage.args = {
  userType: 'operator',
}

export const moderatorFrontpage = Template.bind({})
moderatorFrontpage.args = {
  userType: 'moderator',
}
