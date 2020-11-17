import React from 'react'
import renderer from 'react-test-renderer'
import App from './App'

test('it renders without crashing', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
