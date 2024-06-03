import { notesMachine } from '@/state-machines/notes-state-machine'
import { afterEach, beforeEach, expect } from 'vitest'
import { createActor } from 'xstate'

let notes = createActor(notesMachine)

beforeEach(() => {
  notes = createActor(notesMachine)
  notes.start()
})

afterEach(() => {
  notes.stop()
})

export function adds_a_note() {
  notes.send({ type: 'readyToAddFirstNote' })
  notes.send({ type: 'add', content: 'Note content' })
  expect(notes.getSnapshot().value).toEqual('addingNotes')
  expect(notes.getSnapshot().context.notes).toEqual([
    { id: 1, content: 'Note content', carried: false, page: 0 }
  ])
}

export function adds_22_notes_and_then_refuses_subsequent_notes() {
  notes.send({ type: 'readyToAddFirstNote' })
  for (let i = 0; i < 22; i++) {
    notes.send({ type: 'add', content: 'Note content', page: 0 })
  }
  expect(notes.getSnapshot().context.notes.length).toEqual(22)
  expect(notes.getSnapshot().value).toEqual('choosingNotesToCarry')
}

export function lets_user_carry_notes() {
  notes.send({ type: 'readyToAddFirstNote' })
  for (let i = 0; i < 22; i++) {
    notes.send({ type: 'add', content: 'Note content' })
  }
  for (let i = 0; i < 22; i++) {
    notes.send({ type: 'carry', id: i + 1 })
  }
  expect(notes.getSnapshot().context.notes.filter((n) => n.page === 1).length).toEqual(22)
  expect(notes.getSnapshot().context.notes.filter((n) => n.carried === false).length).toEqual(22)
  expect(notes.getSnapshot().value).toEqual('choosingNotesToCarry')
}

export function lets_user_remove_notes() {
  notes.send({ type: 'readyToAddFirstNote' })
  for (let i = 0; i < 22; i++) {
    notes.send({ type: 'add', content: 'Note content' })
  }
  for (let i = 0; i < 22; i++) {
    notes.send({ type: 'remove', id: i + 1 })
  }
  expect(notes.getSnapshot().context.notes.length).toEqual(0)
  expect(notes.getSnapshot().value).toEqual('addingNotes')
}
