import React from 'react'
import renderer from 'react-test-renderer'
import { ContactForm } from '.'

it('renders without crashing', () => {
  const tree = renderer.create(<ContactForm />).toJSON()
  expect(tree).toMatchSnapshot()
})
