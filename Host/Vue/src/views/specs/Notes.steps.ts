import { expect } from 'vitest'
import { renderNotes } from './Notes.page'

export async function renders_notes() {
  const wrapper = await renderNotes()
  expect(wrapper.text()).toContain('Add your first note')
}
