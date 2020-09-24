import React from 'react'
import renderer from 'react-test-renderer'
import { DropDownMenu } from '.'

it('renders company user without crashing', () => {
  const tree = renderer
    .create(<DropDownMenu username="Jens Jensen" isCompanyUser={true} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders non-company user without crashing', () => {
  const tree = renderer
    .create(<DropDownMenu username="Jens Jensen" isCompanyUser={false} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
