import React from 'react'
import { Provider } from 'use-http'
import { UserProvider } from '../src/utils/context/userContext'
import '../src/index.css'
import { MemoryRouter } from 'react-router-dom'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'grey',
    values: [
      { name: 'white', value: '#FFFFFF' },
      { name: 'grey', value: '#EEEEEE' },
    ],
  },
}

// This token is just an example. If you want a valid token,
// You'll need to get one yourself.
const value =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjdmMDBkOGNhODJiMzIzNWRhNmE5MDYiLCJpYXQiOjE2MDI0Mjg2OTQuNTM3LCJ1c2VybmFtZSI6Im1hcnRpbiIsInVzZXJHcm91cElkIjoiZ2VuZXJhbF91c2VyIiwiZXhwIjoxNjAyNTE1MDk0fQ.OVAfVYsD9tdeylbdMjnmqdpUs7KbdDvhcduJLn6kZrU'

window.localStorage.setItem('token', value)

const options = {
  interceptors: {
    // every time we make an http request, this will run 1st before the request is made
    // url, path and route are supplied to the interceptor
    // request options can be modified and must be returned
    request: ({ options }) => {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${value}`,
      }

      return options
    },
  },
}

const Story = ({ storyFn }) => storyFn()

export const decorators = [
  (storyFn) => (
    <Provider
      url={process.env.REACT_APP_API_URL || 'http://localhost:5000'}
      options={options}
    >
      <UserProvider>
        <MemoryRouter initialEntries={['/add']}>
          <Story storyFn={storyFn} />
        </MemoryRouter>
      </UserProvider>
    </Provider>
  ),
]
