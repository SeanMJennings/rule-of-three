<script setup lang="ts">
import { canCarryNote, notesMachine } from '@/state-machines/notes-state-machine'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import Note from '@/components/notes/Note.vue'
import { reactive, watch } from 'vue'
import styles from './NoteForm.module.css'
import type { SnapshotFrom } from 'xstate'
const props = defineProps<{
  snapshot: SnapshotFrom<typeof notesMachine>,
  send: any
}>()

type Model = { noteText: string }
const model: Model = reactive({ noteText: '' })
watch(model, (newValue: Model, oldValue: Model) => {
  newValue.noteText = oldValue.noteText.slice(0, 150)
})
const disabled = () => model.noteText.length === 0
const submit = () => {
  if (disabled()) return
  props.send({ type: 'add', content: model.noteText })
}
const carry = (id: string | number) => {
  props.send({ type: 'carry', id: id })
}
const remove = (id: string | number) => {
  props.send({ type: 'remove', id: id })
}
</script>

<template>
    <div
      id="add-first-note"
      v-if="snapshot.value === 'empty'"
      v-on:click="send({ type: 'readyToAddFirstNote' })"
    >
      Add your first note
    </div>
    <div :class=styles.addNote id="add-note" v-if="snapshot.value === 'addingNotes'">
      <input id="add-note-input" type="text" v-model="model.noteText" />
      <FontAwesomeIcon
        :class="`${disabled() ? styles.disabled : ''} ${styles.addNoteIcon}`"
        :icon="faPlusSquare"
        id="add-note-submit"
        v-on:click="submit()"
      />
      <span :class=styles.characterCount id="character-count">{{
          model.noteText.length > 0 ? model.noteText.length + '/150' : ''
        }}</span>
    </div>
    <div :class=styles.noteList>
      <Note
        v-for="note in snapshot.context.notes"
        :key="note.id + '.' + note.page"
        :note="note"
        :carry="carry"
        :remove="remove"
        :show-carry-action="
          snapshot.value === 'choosingNotesToCarry' &&
          snapshot.context.notes.find(
            (n) => n.id === note.id && n.carried === false && canCarryNote(n)
          ) !== undefined
        "
        :show-remove-action="
          snapshot.value === 'choosingNotesToCarry' &&
          snapshot.context.notes.find((n) => n.id === note.id && n.carried === false) !==
            undefined
        "
      />
    </div>
</template>