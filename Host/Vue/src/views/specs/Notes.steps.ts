import { expect } from 'vitest'
import { clickAddFirstNote, renderNotes } from './Notes.page'

export async function renders_notes() {
  const notes = await renderNotes()
  expect(notes.text()).toContain('Add your first note')
}

export async function lets_user_add_first_note() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
}
