import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ChooseComponentPage } from '.'

export default {
  title: 'pages/ChooseComponentPagePage',
  component: ChooseComponentPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story = (args) => <ChooseComponentPage {...args} />

export const Standard = Template.bind({})
