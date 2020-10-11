import React from 'react'
import { Story, Meta } from '@storybook/react'

import { SearchField, SearchFieldProps } from '.'

export default {
  title: 'Search field',
  component: SearchField,
} as Meta

const Template: Story<SearchFieldProps> = (args) => <SearchField {...args} />

export const primarySearchField = Template.bind({})
primarySearchField.args = {
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

export const secondarySearchField = Template.bind({})
secondarySearchField.args = {
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
