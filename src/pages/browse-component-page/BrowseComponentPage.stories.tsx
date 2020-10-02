import React from 'react'
import { Story, Meta } from '@storybook/react'

import { BrowseComponentPage, BrowseComponentPageProps } from '.'

export default {
  title: 'Browse',
  Component: BrowseComponentPage,
} as Meta

const Template: Story<BrowseComponentPageProps> = (args) => (
  <BrowseComponentPage {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  component: 'Smoke detector',
  getDescription: () => 'Test',
  getDefinitionDU: () => 'This is DU',
}
