<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { canCarryNote, notesMachine } from '@/state-machines/notes-state-machine'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import Note from '@/components/Note.vue'
import { reactive, watch } from 'vue'
import styles from './Notes.module.css'

const { snapshot, send } = useMachine(notesMachine)
type Model = { noteText: string }
const model: Model = reactive({ noteText: '' })
watch(model, (newValue: Model, oldValue: Model) => {
  newValue.noteText = oldValue.noteText.slice(0, 150)
})
const disabled = () => model.noteText.length === 0
const submit = () => {
  if (disabled()) return
  send({ type: 'add', content: model.noteText })
}
const carry = (id: string | number) => {
  send({ type: 'carry', id: id })
}
const remove = (id: string | number) => {
  send({ type: 'remove', id: id })
}
</script>

<template>
  <main>
    <div :class=styles.container>
      <div>
        
      </div>
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
          :class="disabled() ? styles.addNoteIcon + styles.disabled : styles.addNoteIcon"
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
    </div>
  </main>
</template>