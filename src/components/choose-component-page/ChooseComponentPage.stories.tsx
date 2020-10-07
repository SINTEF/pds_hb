import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ChooseComponentPage, ChooseComponentPageProps } from '.'

export default {
  title: 'ChooseComponentPagePage',
  component: ChooseComponentPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ChooseComponentPageProps> = (args) => (
  <ChooseComponentPage {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  getComponents: () => [
    'Fire detector',
    'Flame detector',
    'Smoke detector',
    'more',
    'even more',
    'testing,',
    'cake',
    'eigwubrivbgwbgu2',
    'iwbfbefye',
    'detectorini',
    'frbyggggggggggg',
    'cake',
    'eigwubrivbgwbgu2',
    'iwbfbefye',
    'detectorini',
  ],
  getEquipmentGroups: () => [
    'Fire Equipment',
    'Cake Equipment',
    'Some other eq group',
  ],
  getModules: () => ['Input Devices', 'Control logic units'],
}
