import React from 'react'
import { Story, Meta } from '@storybook/react'
import { FilterButton, FilterButtonProps } from '.'

export default {
  title: 'FilterButton',
  component: FilterButton,
} as Meta

const Template: Story<FilterButtonProps> = (args) => <FilterButton {...args} />

export const StandardFilterButton = Template.bind({})
StandardFilterButton.args = {
  label: 'Flame detector',
}
