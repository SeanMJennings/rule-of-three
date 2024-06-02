<script setup lang="ts">
import { useActor } from '@xstate/vue'
import { notesMachine } from '@/state-machines/notes-state-machine'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import Note from '@/components/Note.vue'
import { reactive, watch } from 'vue'

const { snapshot, send } = useActor(notesMachine)
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
</script>

<template>
  <main>
    <div class="container">
      <div
        id="add-first-note"
        v-if="snapshot.value === 'empty'"
        v-on:click="send({ type: 'readyToAddFirstNote' })"
      >
        Add your first note
      </div>
      <div class="addNote" id="add-note" v-if="snapshot.value === 'addingFirstNote'">
        <input id="add-note-input" type="text" v-model="model.noteText" />
        <FontAwesomeIcon
          :class="disabled() ? 'addNoteIcon disabled' : 'addNoteIcon'"
          :icon="faPlusSquare"
          id="add-note-submit"
          v-on:click="submit()"
        />
        <span class="characterCount" id="character-count">{{
          model.noteText.length > 0 ? model.noteText.length + '/150' : ''
        }}</span>
      </div>
      <div class="noteList">
        <Note v-for="note in snapshot.context.notes" :key="note.id" :note="note" />
      </div>
    </div>
  </main>
</template>

<style src="@/Views/Notes.css" scoped></style>
