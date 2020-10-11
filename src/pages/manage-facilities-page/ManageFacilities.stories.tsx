import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ManageFacilitiesPage, ManageFacilitiesPageProps } from '.'

export default {
  title: 'pages/Mange facilities',
  component: ManageFacilitiesPage,
} as Meta

const Template: Story<ManageFacilitiesPageProps> = (args) => (
  <ManageFacilitiesPage {...args} />
)

export const Standard = Template.bind({})
Standard.args = {
  getFacilities: () => [
    'Askeladden',
    'Troll',
    'Gullfaks A',
    'Draugen',
    'Veslefrikk',
  ],
  editFacilities: (editFacilties: string | Record<string, string>) =>
    editFacilties,
}
