import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AddDataPage, AddDataPageProps } from '.'

export default {
  title: 'AddDataPagePage',
  component: AddDataPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<AddDataPageProps> = (args) => <AddDataPage {...args} />

export const Standard = Template.bind({})
Standard.args = {
  getComponents: () => ['Fire edtector', 'Flame detector', 'Smoke detector'],
  getFacilities: () => [
    'Askeladden',
    'Troll',
    'Gullfaks A',
    'Draugen',
    'Veslefrikk',
  ],
}
