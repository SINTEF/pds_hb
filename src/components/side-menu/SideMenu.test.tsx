import React from 'react'
import renderer from 'react-test-renderer'
import { SideMenu } from '.'

it('renders without crashing', () => {
  const tree = renderer
    .create(<SideMenu menu={['Approve new users', 'test menu']} alert={6} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
