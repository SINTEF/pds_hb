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
    {
      id: 'fsfsa',
      name: 'Fire equipment',
    },
    {
      id: 'fsfssdafsda',
      name: 'Flame equipment',
    },
    {
      id: 'fsfsaaafavcsdva',
      name: 'Smoke equipment',
    },
    {
      id: 'fsfsafsadnb,',
      name: 'Test equipment',
    },
    {
      id: 'fsfsaasdf',
      name: 'afkjhaslkjf equipment',
    },
    {
      id: 'fsfsasfk',
      name: 'Jada equipment',
    },
  ],
  getEquipmentGroups: () => [
    {
      id: 'fsfsa',
      name: 'Fire equipment',
    },
    {
      id: 'fsfssdafsda',
      name: 'Flame equipment',
    },
  ],
}
