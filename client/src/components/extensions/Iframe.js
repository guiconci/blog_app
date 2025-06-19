import { Node } from '@tiptap/core'

export default Node.create({
  name: 'iframe',

  group: 'block',
  atom: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'iframe-wrapper' },
      ['iframe', { ...HTMLAttributes }],
    ]
  },
})
