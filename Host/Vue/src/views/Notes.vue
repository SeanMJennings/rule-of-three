<script setup lang="ts">
import { useActorRef } from '@xstate/vue'
import { notesMachine } from '@/state-machines/notes-state-machine'
const notesActor = useActorRef(notesMachine)
notesActor.start()
</script>

<template>
  <main>
    <div class="container">
      <div
        class="addFirstNote"
        v-if="notesActor.getSnapshot().value === 'empty'"
        v-on:click="notesActor.send({ type: 'readyToAddFirstNote' })"
      >
        Add your first note
      </div>
      <div
        class="addNote"
        v-if="notesActor.getSnapshot().value === 'addingFirstNote'"
        v-on:click="notesActor.send({ type: 'readyToAddFirstNote' })"
      >
        <input id="add-note-input" type="text" />
      </div>
    </div>
  </main>
</template>

<style src="@/Views/Notes.css" scoped></style>
