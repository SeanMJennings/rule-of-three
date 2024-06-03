import { expect } from 'vitest'
import {
  addFirstNoteHidden,
  addNote,
  addNoteVisible,
  carryNote,
  carryNoteHidden,
  characterCount,
  characterCountHidden,
  clickAddFirstNote,
  noteVisible,
  renderNotes,
  typeNote
} from './Notes.page'

const testNoteText = 'Hello, world!'
const testNoteTextMoreThan150Chars =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa'

export async function renders_notes() {
  const notes = await renderNotes()
  expect(notes.text()).toContain('Add your first note')
}

export async function removes_add_first_note_placeholder_on_click() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  expect(addFirstNoteHidden(notes)).toBe(true)
  expect(addNoteVisible(notes)).toBe(true)
}

export async function disables_add_note_button_when_input_is_empty() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  await addNote(notes)
  expect(addNoteVisible(notes)).toBe(true)
}

export async function adds_and_lists_a_note() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  await typeNote(notes, testNoteText)
  await addNote(notes)
  expect(addNoteVisible(notes)).toBe(true)
  expect(noteVisible(notes, 1, testNoteText)).toBe(true)
}

export async function limits_note_length_to_150_characters() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  await typeNote(notes, testNoteTextMoreThan150Chars)
  await addNote(notes)
  expect(addNoteVisible(notes)).toBe(true)
  expect(noteVisible(notes, 1, testNoteTextMoreThan150Chars.slice(0, 150))).toBe(true)
}

export async function displays_character_count_limit() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  await typeNote(notes, testNoteTextMoreThan150Chars)
  expect(characterCount(notes)).toBe('150/150')
}

export async function character_count_limit_hidden_when_input_is_empty() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  expect(characterCountHidden(notes)).toBe(true)
}

export async function lets_user_carry_notes() {
  const notes = await renderNotes()
  await clickAddFirstNote(notes)
  await typeNote(notes, testNoteTextMoreThan150Chars)
  for (let i = 0; i < 22; i++) {
    await addNote(notes)
  }
  for (let i = 0; i < 22; i++) {
    await carryNote(notes, i + 1)
    expect(carryNoteHidden(notes, i + 1)).toBe(i != 21)
  }
}
