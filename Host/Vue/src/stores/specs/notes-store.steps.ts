import { notesStore } from '@/stores/notes-store'
import { afterEach, beforeEach, expect } from 'vitest'

const notes = notesStore

beforeEach(() => {
  notesStore.start()
})
afterEach(() => {
  notesStore.stop()
})

export async function allows_adding_a_note() {
  notes.send({ type: 'add', note: { id: 1, content: 'Note content' } })
  expect(notesStore.getSnapshot().context.notes).toEqual([{ id: 1, content: 'Note content' }])
}
