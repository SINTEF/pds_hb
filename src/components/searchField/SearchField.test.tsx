import React from 'react'
import renderer from 'react-test-renderer'
import { SearchField } from '.'

it('renders primary without crashing', () => {
  const tree = renderer
    .create(
      <SearchField
        onValueChanged={() => {
          return
        }}
        defaultValue=""
        icon="search"
        suggestions={['test', 'test2']}
        variant="primary"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders standard without crashing', () => {
  const tree = renderer
    .create(
      <SearchField
        onValueChanged={() => {
          return
        }}
        defaultValue=""
        icon="search"
        suggestions={['test', 'test2']}
        variant="primary"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
