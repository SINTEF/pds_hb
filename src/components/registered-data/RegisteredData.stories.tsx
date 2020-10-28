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

const filters: Record<string, string[]> = {
  'Smoke detector': ['L1', 'L2', 'L3'],
  'Flame detector': ['L2', 'L3'],
}
const filterValues: Record<string, Record<string, boolean>> = {
  L1: {
    A1: true,
    A2: false,
    A3: true,
  },
  L2: {
    A1: true,
    A2: false,
    A3: true,
  },
  L3: {
    A1: true,
    A2: false,
    A3: true,
  },
}

export const Standard = Template.bind({})
Standard.args = {
  component: 'Smoke detector',
  equipmentgroup: 'Fire detectors',
  getComponents: () => ['Smoke detector', 'Flame detector'],
  getFilters: (component) => filters[component],
  getValuesForFilter: (filter) => filterValues[filter],
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
