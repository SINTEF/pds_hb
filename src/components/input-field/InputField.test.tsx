import React from 'react'
import renderer from 'react-test-renderer'
import { InputField } from '.'

it('renders without crashing', () => {
  const tree = renderer
    .create(
      <InputField
        label="Test"
        onValueChanged={() => {
          return
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
