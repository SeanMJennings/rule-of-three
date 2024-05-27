import { mount, VueWrapper } from '@vue/test-utils'
import Notes from '../Notes.vue'

export async function renderNotes() {
  return mountNotes()
}
export async function clickAddFirstNote(component: VueWrapper) {
  await component.find('#add-first-note').trigger('click')
}

function mountNotes() {
  return mount(Notes, {})
}
