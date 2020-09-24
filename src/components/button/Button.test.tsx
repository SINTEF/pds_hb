import React from 'react'
import renderer from 'react-test-renderer'
import { Button } from '.'

it('renders without crashing', () => {
  const tree = renderer
    .create(
      <Button
        onClick={() => {
          return
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
