import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Frontpage, FrontpageProps } from '.'

export default {
  title: 'pages/Frontpage',
  component: Frontpage,
} as Meta

const Template: Story<FrontpageProps> = (args) => <Frontpage {...args} />

export const generalFrontpage = Template.bind({})
generalFrontpage.args = {
  userType: 'general',
  suggestions: [
    'Flame detector',
    'Smoke detector',
    'Cake detector',
    'Metal detector',
    'Flamethrower',
    'banana',
  ],
}

export const operatorFrontpage = Template.bind({})
operatorFrontpage.args = {
  userType: 'operator',
  suggestions: [
    'Flame detector',
    'Smoke detector',
    'Cake detector',
    'Metal detector',
    'Flamethrower',
    'banana',
  ],
}

export const moderatorFrontpage = Template.bind({})
moderatorFrontpage.args = {
  userType: 'moderator',
  suggestions: [
    'Flame detector',
    'Smoke detector',
    'Cake detector',
    'Metal detector',
    'Flamethrower',
    'banana',
  ],
}
