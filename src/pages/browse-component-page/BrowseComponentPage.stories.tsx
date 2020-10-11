import React from 'react'
import { Story, Meta } from '@storybook/react'

import { BrowseComponentPage, BrowseComponentPageProps } from '.'

export default {
  title: 'pages/Browse',
  component: BrowseComponentPage,
} as Meta

const Template: Story<BrowseComponentPageProps> = (args) => (
  <BrowseComponentPage {...args} />
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
  getDescription: () =>
    'The detector includes the sensor and local electronics such as the address-/ interface unit.',
  getDefinitionDU: () => 'This is DU',
  getDateOfRevision: () => '23.03.2020',
  getRemarks: () => 'Remark this',
  getRecommendedValues: () => 'Recommended values',
  getHeaders: () => [
    'Failure rates',
    'Source',
    'DU',
    'T',
    'Obs period',
    'Population size',
    'Comment',
  ],
  getFailureData: () => [
    ['0,3', 'A', '5', '0', '2006-2008', '231', ''],
    ['0,3', 'B', '7', '0', '2013-2017', '87', ''],
    ['0,3', 'A', '11', '0', '2012-2020', '763', 'Fake news'],
  ],
}
