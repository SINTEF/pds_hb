import React from 'react'
import renderer from 'react-test-renderer'
import { Header } from '.'

it('renders without crashing', () => {
  const tree = renderer
    .create(
      <Header
        isCompanyUser={true}
        username="Navn Navnesen"
        onClick={() => {
          return
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
