import React, { useRef } from 'react'
import JoditEditor from 'jodit-react'

export interface RichEditorProps {
  value: string
  onChanged: (value: string) => void
}

export const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChanged,
}: RichEditorProps) => {
  const editor = useRef(null)
  // Types are missing for this object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const joditConfig: any = {
    // all options from https://xdsoft.net/jodit/doc/
    height: '90vh',
    language: 'en',
    tabIndex: 1,
    showCharsCounter: false,
    disablePlugins: ['source, image'],
    buttons: [
      'bold',
      'strikethrough',
      'underline',
      'italic',
      'eraser',
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'table',
      'link',
      '|',
      'align',
      'undo',
      'redo',
      '\n',
      'selectall',
      'cut',
      'copy',
      'paste',
      'copyformat',
      '|',
      'hr',
      'symbol',
      'fullsize',
      'print',
      'preview',
      'find',
    ],
  }

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={joditConfig}
      // This is due to a bug in the current build of Jodit
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur={(newContent: any) => {
        onChanged(newContent.target.innerHTML)
      }}
    />
  )
}
