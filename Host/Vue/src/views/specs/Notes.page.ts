import { mount, VueWrapper } from '@vue/test-utils'
import Notes from '../Notes.vue'

let page: VueWrapper

export function renderNotesView() {
  page = mountNotesView()
}

export function pageText() {
  return page.text()
}

export async function clickAddFirstNote() {
  await elements.addFirstNote.trigger('click')
}

export function addFirstNoteHidden() {
  return !elements.addFirstNote.exists()
}

export function noteCountHidden() {
  return !elements.noteCount.exists()
}

export function noteCount() {
  return elements.noteCount.text()
}

export function addNoteVisible() {
  return elements.addNote.exists()
}

export function typeNote(note: string) {
  return elements.addNoteInput.setValue(note)
}
export function addNote() {
  return elements.addNoteSubmit.trigger('click')
}

export function noteVisible(noteId: string | number, note: string) {
  return elements.noteId(noteId).text() === note
}

export function characterCount() {
  return elements.characterCount.text()
}

export function characterCountHidden() {
  return elements.characterCount.text() === ''
}

export async function carryNote(noteId: string | number) {
  return elements.noteCarry(noteId).trigger('click')
}

export async function removeNote(noteId: string | number) {
  return elements.noteRemove(noteId).trigger('click')
}

export function carryNoteHidden(noteId: string | number) {
  return !elements.noteCarry(noteId).exists()
}

export function notePageNumber(noteId: string | number) {
  return elements.notePage(noteId).text()
}

export function removeNoteHidden(noteId: string | number) {
  return !elements.noteRemove(noteId).exists()
}

function mountNotesView() {
  return mount(Notes, {})
}

const elements = {
  get addFirstNote() {
    return page.find('#add-first-note')
  },
  get noteCount() {
    return page.find('#note-count')
  },
  get addNote() {
    return page.find('#add-note')
  },
  get addNoteInput() {
    return page.find('#add-note-input')
  },
  get addNoteSubmit() {
    return page.find('#add-note-submit')
  },
  get characterCount() {
    return page.find('#character-count')
  },
  noteId(noteId: string | number) {
    return page.find(`#note-${noteId}`)
  },
  noteCarry(noteId: string | number) {
    return page.find(`#note-${noteId}-carry`)
  },
  noteRemove(noteId: string | number) {
    return page.find(`#note-${noteId}-remove`)
  },
  notePage(noteId: string | number) {
    return page.find(`#note-${noteId}-page`)
  }
}
