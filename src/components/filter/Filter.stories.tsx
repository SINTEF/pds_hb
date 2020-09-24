import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Filter, FilterProps } from '.'

export default {
  title: 'Filter',
  component: Filter,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<FilterProps> = (args) => <Filter {...args} />

export const FilterComponent = Template.bind({})
FilterComponent.args = {
  filters: [
    'Flame detector',
    'Smoke detector',
    'Other component',
    'Some component',
    'Component with a very long name',
  ],
  category: 'Components',
}
