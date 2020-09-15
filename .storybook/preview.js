import '../src/index.css'

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
