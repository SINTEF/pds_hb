import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ChooseFacility, ChooseFacilityProps } from '.'

export default {
  title: 'ChooseFacilityPage',
  component: ChooseFacility,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ChooseFacilityProps> = (args) => (
  <ChooseFacility {...args} />
)

export const Standard = Template.bind({})
Standard.args = {}
