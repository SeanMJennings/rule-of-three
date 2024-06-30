import { expect } from 'vitest'
import {
  addFirstNoteHidden,
  addNote,
  addNoteVisible,
  carryNote,
  carryNoteHidden,
  characterCount,
  characterCountHidden,
  clickAddFirstNote, noteCount, noteCountHidden,
  notePageNumber,
  noteVisible,
  pageText,
  removeNote,
  removeNoteHidden,
  renderNotesView,
  typeNote
} from './Notes.page'

const testNoteText = 'Hello, world!'
const testNoteTextMoreThan150Chars =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa'

export async function renders_notes() {
  renderNotesView()
  expect(pageText()).toContain('Add your first note')
}

export async function asks_user_to_create_first_note_list() {
  renderNotesView()
  expect(pageText()).toContain('Create your first note list')
  expect(pageText()).not.toContain('Create your first note list')
}

export async function removes_add_first_note_placeholder_on_click() {
  renderNotesView()
  await clickAddFirstNote()
  expect(addFirstNoteHidden()).toBe(true)
  expect(addNoteVisible()).toBe(true)
}

export async function shows_note_count_if_there_are_notes() {
  renderNotesView()
  await clickAddFirstNote()
  expect(noteCountHidden()).toBe(true)
  await typeNote(testNoteText)
  await addNote()
  expect(noteCount()).toBe('1/22 notes')
}

export async function disables_add_note_button_when_input_is_empty() {
  renderNotesView()
  await clickAddFirstNote()
  await addNote()
  expect(addNoteVisible()).toBe(true)
}

export async function adds_and_lists_a_note() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteText)
  await addNote()
  expect(addNoteVisible()).toBe(true)
  expect(noteVisible(1, testNoteText)).toBe(true)
}

export async function limits_note_length_to_150_characters() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  await addNote()
  expect(addNoteVisible()).toBe(true)
  expect(noteVisible(1, testNoteTextMoreThan150Chars.slice(0, 150))).toBe(true)
}

export async function displays_character_count_limit() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  expect(characterCount()).toBe('150/150')
}

export async function character_count_limit_hidden_when_input_is_empty() {
  renderNotesView()
  await clickAddFirstNote()
  expect(characterCountHidden()).toBe(true)
}

export async function lets_user_carry_notes() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  for (let i = 0; i < 22; i++) {
    await addNote()
  }
  for (let i = 0; i < 22; i++) {
    await carryNote(i + 1)
    expect(carryNoteHidden(i + 1)).toBe(i != 21)
  }
}

export async function lets_user_remove_notes() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  for (let i = 0; i < 22; i++) {
    await addNote()
  }
  for (let i = 0; i < 22; i++) {
    await removeNote(i + 1)
    expect(removeNoteHidden(i + 1)).toBe(true)
  }
}

export async function displays_page_number_of_notes() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  for (let i = 0; i < 22; i++) {
    await addNote()
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 22; i++) {
      expect(notePageNumber(i + 1)).toBe(j.toString())
      await carryNote(i + 1)
      expect(notePageNumber(i + 1)).toBe((j + 1).toString())
    }
  }
}

export async function only_shows_remove_notes_for_notes_carried_twice() {
  renderNotesView()
  await clickAddFirstNote()
  await typeNote(testNoteTextMoreThan150Chars)
  for (let i = 0; i < 22; i++) {
    await addNote()
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 22; i++) {
      await carryNote(i + 1)
    }
  }
  for (let i = 0; i < 22; i++) {
    expect(carryNoteHidden(i + 1)).toBe(true)
    expect(removeNoteHidden(i + 1)).toBe(false)
  }
}
