import { assign, createMachine } from 'xstate'
import type { Notes } from '@/types/types'

export const notesMachine = createMachine({
  context: { notes: [] as Notes },
  on: {
    add: {
      actions: assign({
        notes: ({ context, event }) => context.notes.concat(event.note)
      })
    }
  },
  initial: 'empty',
  states: {
    empty: {
      on: {
        readyToAddFirstNote: {
          target: 'addingFirstNote'
        }
      }
    },
    addingFirstNote: {
      on: {
        add: {
          target: 'addingMoreNotes'
        }
      }
    },
    addingMoreNotes: {}
  }
})
