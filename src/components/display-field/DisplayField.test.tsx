import React from 'react'
import renderer from 'react-test-renderer'
import { DisplayField } from '.'

it('renders without crashing', () => {
  const tree = renderer
    .create(<DisplayField index="Test" content="TestContent" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
