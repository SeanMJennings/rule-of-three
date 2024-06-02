import { mount, VueWrapper } from '@vue/test-utils'
import Notes from '../Notes.vue'

export async function renderNotes() {
  return mountNotes()
}
export async function clickAddFirstNote(component: VueWrapper) {
  await component.find('#add-first-note').trigger('click')
}

export function addFirstNoteHidden(component: VueWrapper) {
  return !component.find('#add-first-note').exists()
}

export function addNoteVisible(component: VueWrapper) {
  return component.find('#add-note').exists()
}

export function typeNote(component: VueWrapper, note: string) {
  return component.find('#add-note-input').setValue(note)
}
export function addNote(component: VueWrapper) {
  return component.find('#add-note-submit').trigger('click')
}

export function noteVisible(component: VueWrapper, noteId: string | number, note: string) {
  return component.find(`#note-${noteId}`).text() === note
}

export function characterCount(component: VueWrapper) {
  return component.find('#character-count').text()
}

export function characterCountHidden(component: VueWrapper) {
  return component.find('#character-count').text() === ''
}

function mountNotes() {
  return mount(Notes, {})
}
