import React from 'react'
import { Story, Meta } from '@storybook/react'
import { CommentSectionProps, CommentSection } from '.'

export default {
  title: 'View long text',
  component: CommentSection,
} as Meta

const Template: Story<CommentSectionProps> = (args) => (
  <CommentSection {...args} />
)

export const Standard = Template.bind({})
Standard.parameters = {
  storyshots: { disable: true },
}
Standard.args = {
  isOpen: true,
}
