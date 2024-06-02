import { assign, createMachine } from 'xstate'
import type { Notes } from '@/types/types'

const getNextNoteId = function (notes: Notes) {
  let maxValue = 0

  notes.map((el) => {
    const valueFromObject = el.id
    maxValue = Math.max(maxValue, valueFromObject)
  })
  return maxValue === 0 ? 1 : maxValue + 1
}

export const notesMachine = createMachine({
  context: { notes: [] as Notes },
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
          actions: assign({
            notes: ({ context, event }) =>
              context.notes.concat({
                id: getNextNoteId(context.notes),
                content: event.content
              })
          })
        }
      }
    },
    success: {
      always: 'addingFirstNote'
    }
  }
})
