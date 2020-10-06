import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Table, TableProps } from '.'

export default {
  title: 'Table',
  component: Table,
} as Meta

const Template: Story<TableProps> = (args) => <Table {...args} />

export const TableComponent = Template.bind({})
TableComponent.args = {
  data: [
    [
      '0,3',
      'Facility A',
      '10',
      '2,8*10^7 h',
      '2006-2018',
      '659',
      'Very cool data',
    ],
    [
      '0,5',
      'Facility C',
      '8',
      '2,8* 10^9 h',
      '1999-2020',
      '666',
      'This data is data',
    ],
    [
      '0,8',
      'Facility B',
      '12',
      '2,7* 10^5 h',
      '2019-2020',
      '123',
      'Another instance of data',
    ],
    [
      '0,8',
      'Facility B',
      '12',
      '2,7* 10^5 h',
      '2019-2020',
      '123',
      'Even more data',
    ],
  ],
  headers: [
    'Failure Rates',
    'Source',
    'DUobs',
    'T',
    'Observation Period',
    'Population Size',
    'Comment',
  ],
}
