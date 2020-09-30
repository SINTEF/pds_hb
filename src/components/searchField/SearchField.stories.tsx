import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SearchField, SearchFieldProps } from '.'

export default {
  title: 'Search field',
  component: SearchField,
} as Meta

const Template: Story<SearchFieldProps> = (args) => <SearchField {...args} />

export const primaryInput = Template.bind({})
primaryInput.args = {
  label: 'Search',
  variant: 'primary',
  placeholder: 'Search for component...',
  icon: 'search',
  suggestions: [
    'Flame detector',
    'Smoke detector',
    'Cake detector',
    'Metal detector',
    'Flamethrower',
    'banana',
  ],
  onClick(s) {
    alert(s)
  },
}

export const secondaryInput = Template.bind({})
secondaryInput.args = {
  label: 'Component',
  variant: 'secondary',
  placeholder: 'Set a component...',
  suggestions: [
    'Flame detector',
    'Smoke detector',
    'Cake detector',
    'Metal detector',
    'Flamethrower',
    'banana',
  ],
}
