import { assign, createMachine } from 'xstate'
import type { Note, Notes } from '@/types/types'

const getNextNoteId = function (notes: Notes) {
  let maxValue = 0

  notes.map((el) => {
    const valueFromObject = el.id
    maxValue = Math.max(maxValue, valueFromObject)
  })
  return maxValue === 0 ? 1 : maxValue + 1
}

export const itemLimit = 22

const notesAreFull = function (context: { notes: Notes }) {
  return context.notes.length >= itemLimit
}

const notesHaveBeenCarried = function (context: { notes: Notes }): boolean {
  return context.notes.filter((n) => !n.carried).length === 0
}

export const canCarryNote = function (note: Note): boolean {
  return note.page <= 1
}

export const notesMachine = createMachine(
  {
    types: {} as {
      context: { notes: Notes }
    },
    context: { notes: [] },
    initial: 'empty',
    states: {
      empty: {
        on: {
          readyToAddFirstNote: {
            target: 'addingNotes'
          }
        }
      },
      addingNotes: {
        on: {
          add: {
            actions: assign({
              notes: ({ context, event }) =>
                context.notes.concat({
                  id: getNextNoteId(context.notes),
                  content: event.content,
                  carried: false,
                  page: 0
                })
            })
          }
        },
        always: {
          guard: 'notesAreFull',
          target: 'choosingNotesToCarry'
        }
      },
      choosingNotesToCarry: {
        on: {
          carry: {
            actions: assign({
              notes: ({ context, event }) => {
                const note = context.notes.find((note) => note.id === event.id) ?? ({} as Note)
                if (canCarryNote(note)) {
                  note.page += 1
                  note.carried = true
                }
                return context.notes
              }
            })
          },
          remove: {
            actions: assign({
              notes: ({ context, event }) => {
                context.notes = context.notes.filter((note) => note.id !== event.id)
                return context.notes
              }
            })
          }
        },
        always: {
          guard: 'notesHaveAllBeenCarried',
          target: 'addingNotes'
        },
        exit: [
          (context) => {
            context.context.notes = context.context.notes.map((note) => {
              note.carried = false
              return note
            })
          }
        ]
      },
      success: {
        always: 'addingNotes'
      }
    }
  },
  {
    guards: {
      notesHaveAllBeenCarried: ({ context }) => {
        return notesHaveBeenCarried(context)
      },
      notesAreFull: ({ context }) => {
        return notesAreFull(context)
      }
    }
  }
)