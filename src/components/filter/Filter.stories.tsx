import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Filter, FilterProps } from '.'

export default {
  title: 'Filter',
  component: Filter,
} as Meta

const Template: Story<FilterProps> = (args) => <Filter {...args} />

export const FilterComponent = Template.bind({})
FilterComponent.args = {
  filters: {
    'Flame detector': true,
    'Smoke detector': false,
    'Other component': true,
    'Some component': true,
    'Component with a very long name': true,
    'cake detector': false,
  },
  category: 'Components',
  onClick(s, value) {
    alert(s + ': ' + value)
  },
}
