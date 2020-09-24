import React from 'react'
import renderer from 'react-test-renderer'
import { MenuButton } from '.'

it('renders without crashing', () => {
  const tree = renderer.create(<MenuButton label="Test button" />).toJSON()
  expect(tree).toMatchSnapshot()
})
