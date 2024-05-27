import { mount } from '@vue/test-utils'
import { beforeEach } from 'vitest'
import Notes from '../Notes.vue'

beforeEach(() => {})

export async function renderNotes() {
  const notes = mountNotes()
  return notes
}

function mountNotes() {
  return mount(Notes, {})
}
