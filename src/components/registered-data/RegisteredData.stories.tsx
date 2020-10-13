import React from 'react'
import { Story, Meta } from '@storybook/react'

import { RegisteredData, RegisteredDataProps } from '.'

export default {
  title: 'RegisteredData',
  Component: RegisteredData,
} as Meta

const Template: Story<RegisteredDataProps> = (args) => (
  <RegisteredData {...args} />
)

const values: Record<string, string[]> = {
  L1: ['V1', 'V2', 'V3'],
  L2: ['V2', 'V3'],
  L3: ['V4', 'V5'],
}

const filters: Record<string, string[]> = {
  'Smoke detector': ['L1', 'L2', 'L3'],
  'Flame detector': ['L2', 'L3'],
}

export const Standard = Template.bind({})
Standard.args = {
  component: 'Smoke detector',
  equipmentgroup: 'Fire detectors',
  getComponents: () => ['Smoke detector', 'Flame detector'],
  getFilters: (component) => filters[component],
  getValuesForFilter: (filter) => values[filter],
  getUserGroup: () => 'Operator',
  getFailureData: () => [
    {
      _id: 'object1',
      period: '2013-2020',
      t: '123456',
      tags: 99,
      du: 5,
      edited: '24.12.2010',
    },
    {
      _id: 'object2',
      period: '2015-2029',
      t: '654321',
      tags: 29,
      du: 3,
      edited: '23.11.2016',
    },
  ],
}
