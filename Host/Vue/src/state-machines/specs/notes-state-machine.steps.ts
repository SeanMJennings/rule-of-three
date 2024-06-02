import { notesMachine } from '@/state-machines/notes-state-machine'
import { afterEach, beforeEach, expect } from 'vitest'
import { createActor } from 'xstate'

const notes = createActor(notesMachine)

beforeEach(() => {
  notes.start()
})
afterEach(() => {
  notes.stop()
})

export async function adds_a_note() {
  notes.send({ type: 'readyToAddFirstNote' })
  notes.send({ type: 'add', content: 'Note content' })
  expect(notes.getSnapshot().context.notes).toEqual([{ id: 1, content: 'Note content' }])
}
